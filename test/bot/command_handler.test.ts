import {Command} from '../../src/bot/command';
import {CommandHandler} from '../../src/bot/command_handler';

const MockCommandMatcher = jest.fn<jest.Mocked<Command>, [string]>((cmdName: string) => ({
  matches: jest.fn((name: string): boolean => name === cmdName),
  process: jest.fn((..._: string[]): void => {})
}));

const MockCommandAlways = jest.fn<jest.Mocked<Command>, []>(() => ({
  matches: jest.fn((_: string): boolean => true),
  process: jest.fn((..._: string[]): void => {})
}));

const mockCmds: jest.Mocked<Command>[] = [
  new MockCommandMatcher('foo'),
  new MockCommandMatcher('bar'),
];

describe('Command handler', () => {
  beforeEach(() => {
    mockCmds.forEach((mock: jest.Mocked<Command>) => {
      mock.matches.mockClear();
      mock.process.mockClear();
    });
  });

  describe('handles commands', () => {
    it('ignores messages not starting with "!"', () => {
      const handler = new CommandHandler(mockCmds);

      handler.handle('test');

      mockCmds.forEach(cmd => {
        expect(cmd.matches.mock.calls.length).toBe(0);
        expect(cmd.process.mock.calls.length).toBe(0);
      });
    });

    it('checks every command for unknown command name', () => {
      const handler = new CommandHandler(mockCmds);

      handler.handle('!test');

      mockCmds.forEach(cmd => {
        expect(cmd.process.mock.calls.length).toBe(0);
        expect(cmd.process.mock.calls.length).toBe(0);
      });
    });

    it('throws an error if multiple commands match', () => {
      const handler = new CommandHandler([...mockCmds, new MockCommandAlways()]);

      expect(() => handler.handle('!foo')).toThrow(Error);
      expect(() => handler.handle('!bar')).toThrow(Error);
    });
  });

  describe('processes command', () => {
    it('processes only matching command', () => {
      const handler = new CommandHandler(mockCmds);

      handler.handle('!foo');

      expect(mockCmds[0].process.mock.calls.length).toBe(1);
      expect(mockCmds[1].process.mock.calls.length).toBe(0);
    });

    it('sends empty argument list for no arguments', () => {
      const handler = new CommandHandler(mockCmds);

      handler.handle('!foo');

      expect(mockCmds[0].process.mock.calls[0].length).toBe(0);
    });

    it('sends argument list for one argument', () => {
      const handler = new CommandHandler(mockCmds);

      handler.handle('!foo one');

      expect(mockCmds[0].process.mock.calls[0].length).toBe(1);
      expect(mockCmds[0].process.mock.calls[0][0]).toBe('one');
    });

    it('sends argument list for multiple arguments', () => {
      const handler = new CommandHandler(mockCmds);

      handler.handle('!foo one 2 three');

      expect(mockCmds[0].process.mock.calls[0].length).toBe(3);
      expect(mockCmds[0].process.mock.calls[0]).toEqual(['one', '2', 'three']);
    });
  });
});
