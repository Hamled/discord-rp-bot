import {StartCommand} from '../../../src/bot/commands/start';

describe('start command', () => {
  describe('matches', () => {
    it('should match command name "start"', () => {
      const cmd = new StartCommand();

      expect(cmd.matches('start')).toBe(true);
    });

    it('should not match anything else', () => {
      const cmd = new StartCommand();

      ['', ' ', 'hello', 'stop', '!start'].forEach(name => {
        expect(cmd.matches(name)).toBe(false);
      });
    });
  });
});
