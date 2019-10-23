import {Session} from '../../../src/models';
import {StopCommand} from '../../../src/bot/commands/stop';
import {FakeEntityManager, FakeMsgContext} from '../../fakes';

jest.mock('../../../src/models/session.ts');

describe('start command', () => {
  let cmd: StopCommand;
  let manager: FakeEntityManager;
  let fakeSession: Session;
  beforeEach(() => {
    manager = new FakeEntityManager();
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
      const context = new FakeMsgContext('12345', fakeSession);
      const now = new Date();

      await cmd.process(context);

      expect(fakeSession.endDate).toBeDefined();
      expect(fakeSession.endDate! >= now).toBe(true);
    });

    it('should save the inactive session', async () => {
      expect.assertions(2);
      const context = new FakeMsgContext('12345', fakeSession);
      const numSavedEntities = manager.savedEntities.length;

      await cmd.process(context);

      expect(manager.savedEntities.length).toBe(numSavedEntities + 1);
      expect(manager.savedEntities[numSavedEntities]).toBe(fakeSession);
    })

    it('should return context without a session', async () => {
      expect.assertions(1);
      const context = new FakeMsgContext('12345', fakeSession);

      const newContext = await cmd.process(context);

      expect(newContext).toEqual({...context, session: undefined});
    });

    it('should not do anything if context has no session', async () => {
      expect.assertions(2);
      const context = new FakeMsgContext('12345');
      const numSavedEntities = manager.savedEntities.length;

      const newContext = await cmd.process(context);

      expect(manager.savedEntities.length).toBe(numSavedEntities);
      expect(newContext).toEqual(context);
    });
  })
});
