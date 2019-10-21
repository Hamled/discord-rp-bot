import {EntityManager} from 'typeorm';
import {Channel} from 'discord.js';
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

const fakeContext = (channelId?: string): MsgContext => ({
  channel: new Channel(null, {id: channelId || ''})
});

describe('start command', () => {
  let cmd: StartCommand;
  let manager: FakeManager;
  beforeEach(() => {
    manager = new FakeManager();
    cmd = new StartCommand(manager);
    (Session as jest.Mock<Session>).mockClear();
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
      const numSavedEntities = manager.savedEntities.length;

      cmd.process(fakeContext());

      expect(Session).toHaveBeenCalledTimes(1);
      expect(manager.savedEntities.length).toBe(numSavedEntities + 1);
      expect(manager.savedEntities[numSavedEntities]).toBeInstanceOf(Session);
    });

    it('should set the new session\'s channel ID from the context', () => {
      const channelId = '12345';

      cmd.process(fakeContext(channelId));

      const session = (Session as jest.Mock<Session>).mock.instances[0];
      expect(session.channelId).toEqual(channelId);
    });
  })
});
