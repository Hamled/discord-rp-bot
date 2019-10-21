import {EntityManager} from 'typeorm';
import {Session} from '../../../src/models/session';
import {StartCommand} from '../../../src/bot/commands/start';
import {MsgContext} from '../../../src/bot/msg_context';

jest.mock('../../../src/models/session.ts');

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

const fakeContext = (): MsgContext => ({
  channel: null
});

describe('start command', () => {
  let cmd: StartCommand;
  let manager: FakeManager;
  beforeEach(() => {
    manager = new FakeManager();
    cmd = new StartCommand(manager);
  });

  describe('matches', () => {
    it('should match command name "start"', () => {
      expect(cmd.matches('start')).toBe(true);
    });

    it('should not match anything else', () => {
      ['', ' ', 'hello', 'stop', '!start'].forEach(name => {
        expect(cmd.matches(name)).toBe(false);
      });
    });
  });

  describe('process', () => {
    it('should save a new session', () => {
      cmd.process(fakeContext());

      expect(Session).toHaveBeenCalledTimes(1);
      expect(manager.savedEntities.length).toBe(1);
      expect(manager.savedEntities[0]).toBeInstanceOf(Session);
    });
  })
});
