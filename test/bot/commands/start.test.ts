import {Session} from '../../../src/models';
import {StartCommand} from '../../../src/bot/commands/start';
import {SessionRecorder} from '../../../src/bot/session_recorder';
import {FakeEntityManager, FakeMsgContext, FakeTextChannel} from '../../fakes';

jest.mock('../../../src/models/session.ts');
const SessionMock = Session as jest.Mock<Session>;

jest.mock('../../../src/bot/session_recorder.ts');
const SessionRecorderMock = (SessionRecorder as unknown) as jest.Mock<SessionRecorder>;

describe('start command', () => {
  let cmd: StartCommand;
  let manager: FakeEntityManager;
  let fakeSession: Session;
  beforeEach(() => {
    manager = new FakeEntityManager();
    cmd = new StartCommand(manager);

    fakeSession = new Session();
    manager.save(fakeSession);

    SessionMock.mockClear();
    SessionRecorderMock.mockClear();
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
    it('should return a context with a session', async () => {
      expect.assertions(1);
      const newContext = await cmd.process(new FakeMsgContext());

      expect(newContext.session).toBeDefined();
    });

    it('should return a context with a session recorder', async () => {
      expect.assertions(1);
      const newContext = await cmd.process(new FakeMsgContext());

      expect(newContext.recorder).toBeDefined();
    });

    describe('when session does not exist', () => {
      it('should save a new session', async () => {
        expect.assertions(3);
        const numSavedEntities = manager.savedEntities.length;

        await cmd.process(new FakeMsgContext());

        expect(Session).toHaveBeenCalledTimes(1);
        expect(manager.savedEntities.length).toBe(numSavedEntities + 1);
        expect(manager.savedEntities[numSavedEntities]).toBeInstanceOf(Session);
      });

      it('should set the new session\'s channel ID from the context', async () => {
        expect.assertions(1);
        const channelId = '12345';

        await cmd.process(new FakeMsgContext(channelId));

        const session = SessionMock.mock.instances[0];
        expect(session.channelId).toEqual(channelId);
      });

      it('should start recording the session', async () => {
        expect.assertions(2);

        const context = new FakeMsgContext();
        await cmd.process(context);

        const session = SessionMock.mock.instances[0];
        expect(SessionRecorderMock).toHaveBeenCalledWith(session, context.channel, manager);

        const recorder = SessionRecorderMock.mock.results[0].value;
        expect(recorder.start).toHaveBeenCalled();
      });
    });

    describe('when session already exists', () => {
      it('should not create a new session', async () => {
        expect.assertions(3);
        const context = new FakeMsgContext('12345', fakeSession);
        const numSavedEntities = manager.savedEntities.length;

        const newContext = await cmd.process(context);

        expect(Session).toHaveBeenCalledTimes(0);
        expect(manager.savedEntities.length).toBe(numSavedEntities);
        expect(newContext.session).toBe(fakeSession);
      });

      describe('and recorder already exists', () => {
        it('should create a new recorder', async () => {
          expect.assertions(1);

          const context = new FakeMsgContext();
          await cmd.process(context);

          const session = SessionMock.mock.instances[0];
          expect(SessionRecorderMock).toHaveBeenCalledWith(session, context.channel, manager);
        });

        it('should start recording the session', async () => {
          expect.assertions(1);
          const mockRecorder = new SessionRecorder(fakeSession, new FakeTextChannel(), manager);
          const context = new FakeMsgContext('12345', fakeSession, mockRecorder);

          await cmd.process(context);

          expect((mockRecorder as jest.Mocked<SessionRecorder>).start).toHaveBeenCalled();
        });
      });

      describe('and recorder does not exist', () => {
        it('should not create a recorder', async () => {
          expect.assertions(2);
          const mockRecorder = new SessionRecorder(fakeSession, new FakeTextChannel(), manager);
          SessionRecorderMock.mockClear();

          const context = new FakeMsgContext('12345', fakeSession, mockRecorder);

          const newContext = await cmd.process(context);

          expect(SessionRecorderMock).not.toHaveBeenCalled();
          expect(newContext.recorder).toBe(mockRecorder);
        });

        it('should start recording the session', async () => {
          expect.assertions(1);
          const context = new FakeMsgContext('12345', fakeSession);

          await cmd.process(context);

          const recorder = SessionRecorderMock.mock.results[0].value;
          expect(recorder.start).toHaveBeenCalled();
        });
      });
    });
  })
});
