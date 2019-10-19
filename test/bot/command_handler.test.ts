import {CommandHandler} from '../../src/bot/command_handler';

const makeMockCommand = (cmdName) => ({
  matches: jest.fn((name: string): boolean => name === cmdName),
  process: jest.fn((..._: string[]): void => {})
});

const alwaysMatch = {
  matches: jest.fn((_: string): boolean => true),
  process: jest.fn((..._: string[]): void => {})
};

describe('Command handler', () => {

  let mockCmds;
  beforeEach(() => {
    mockCmds = [
      makeMockCommand('foo'),
      makeMockCommand('bar')
    ];
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
      const handler = new CommandHandler([...mockCmds, alwaysMatch]);

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
