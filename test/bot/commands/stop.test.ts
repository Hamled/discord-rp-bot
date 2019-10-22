import {EntityManager} from 'typeorm';
import {Channel} from 'discord.js';
import {Session} from '../../../src/models/session';
import {StopCommand} from '../../../src/bot/commands/stop';
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

const fakeContext = (channelId?: string, session?: Session): MsgContext => ({
  channel: new Channel(null, {id: channelId || ''}),
  session
});

describe('start command', () => {
  let cmd: StopCommand;
  let manager: FakeManager;
  let fakeSession: Session;
  beforeEach(() => {
    manager = new FakeManager();
    cmd = new StopCommand(manager);

    fakeSession = new Session();
    manager.save(fakeSession);

    (Session as jest.Mock<Session>).mockClear();
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

  describe('process', () => {
    it('should end the active session', async () => {
      expect.assertions(2);
      const context = fakeContext('12345', fakeSession);
      const now = new Date();

      await cmd.process(context);

      expect(fakeSession.endDate).toBeDefined();
      expect(fakeSession.endDate >= now).toBe(true);
    });

    it('should save the inactive session', async () => {
      expect.assertions(2);
      const context = fakeContext('12345', fakeSession);
      const numSavedEntities = manager.savedEntities.length;

      await cmd.process(context);

      expect(manager.savedEntities.length).toBe(numSavedEntities + 1);
      expect(manager.savedEntities[numSavedEntities]).toBe(fakeSession);
    })

    it('should not do anything if context has no session', async () => {
      expect.assertions(2);
      const context = fakeContext('12345');
      const numSavedEntities = manager.savedEntities.length;

      const newContext = await cmd.process(context);

      expect(manager.savedEntities.length).toBe(numSavedEntities);
      expect(newContext).toEqual(context);
    });
  })
});
