import {Command} from '../../src/bot/command';
import {CommandHandler} from '../../src/bot/command_handler';
import {MsgContext} from '../../src/bot/msg_context';

const MockCommandMatcher = jest.fn<jest.Mocked<Command>, [string]>((cmdName: string) => ({
  matches: jest.fn((name: string): boolean => name === cmdName),
  process: jest.fn((_: MsgContext, ...__: string[]): Promise<void> => { return; })
}));

const MockCommandAlways = jest.fn<jest.Mocked<Command>, []>(() => ({
  matches: jest.fn((_: string): boolean => true),
  process: jest.fn((_: MsgContext, ...__: string[]): Promise<void> => { return; })
}));

const mockCmds: jest.Mocked<Command>[] = [
  new MockCommandMatcher('foo'),
  new MockCommandMatcher('bar'),
];

describe('Command handler', () => {
  const context: MsgContext = {
    channel: null
  };

  beforeEach(() => {
    mockCmds.forEach((mock: jest.Mocked<Command>) => {
      mock.matches.mockClear();
      mock.process.mockClear();
    });
  });

  describe('handles commands', () => {
    it('ignores messages not starting with "!"', () => {
      const handler = new CommandHandler(mockCmds);

      handler.handle('test', context);

      mockCmds.forEach(cmd => {
        expect(cmd.matches).toHaveBeenCalledTimes(0);
        expect(cmd.process).toHaveBeenCalledTimes(0);
      });
    });

    it('checks every command for unknown command name', () => {
      const handler = new CommandHandler(mockCmds);

      handler.handle('!test', context);

      mockCmds.forEach(cmd => {
        expect(cmd.matches).toHaveBeenCalledTimes(1);
        expect(cmd.process).toHaveBeenCalledTimes(0);
      });
    });

    it('throws an error if multiple commands match', () => {
      const handler = new CommandHandler([...mockCmds, new MockCommandAlways()]);

      expect(() => handler.handle('!foo', context)).toThrow(Error);
      expect(() => handler.handle('!bar', context)).toThrow(Error);
    });
  });

  describe('processes command', () => {
    const fooCmd = mockCmds[0];
    const barCmd = mockCmds[1];

    it('processes only matching command', () => {
      const handler = new CommandHandler(mockCmds);

      handler.handle('!foo', context);

      expect(fooCmd.process).toHaveBeenCalledTimes(1);
      expect(barCmd.process).toHaveBeenCalledTimes(0);
    });

    it('sends empty argument list for no arguments', () => {
      const handler = new CommandHandler(mockCmds);

      handler.handle('!foo', context);

      expect(fooCmd.process).toHaveBeenCalledWith(context);
    });

    it('sends argument list for one argument', () => {
      const handler = new CommandHandler(mockCmds);

      handler.handle('!foo one', context);

      expect(fooCmd.process).toHaveBeenCalledWith(context, 'one');
    });

    it('sends argument list for multiple arguments', () => {
      const handler = new CommandHandler(mockCmds);

      handler.handle('!foo one 2 three', context);

      expect(fooCmd.process).toHaveBeenCalledWith(context, 'one', '2', 'three');
    });
  });
});
