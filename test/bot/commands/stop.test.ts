import {EntityManager} from 'typeorm';
import {StopCommand} from '../../../src/bot/commands/stop';


class FakeManager extends EntityManager {
  public readonly savedEntities: any[] = [];

  constructor() {
    super(null);
  }

  save(entity: any): Promise<any> {
    this.savedEntities.push(entity);

    entity.id = this.savedEntities.length;
    return entity;
  }
}

describe('start command', () => {
  let cmd: StopCommand;
  let manager: FakeManager;
  beforeEach(() => {
    manager = new FakeManager();
    cmd = new StopCommand(manager);
  });

  describe('matches', () => {
    it('should match command name "stop"', () => {
      expect(cmd.matches('stop')).toBe(true);
    });

    it('should not match anything else', () => {
      ['', ' ', 'hello', 'start', '!stop'].forEach(name => {
        expect(cmd.matches(name)).toBe(false);
      });
    });
  });
});
