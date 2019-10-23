import {Session, Post} from '../../src/models';
import {SessionRecorder} from '../../src/bot/session_recorder';
import {FakeTextChannel, FakeEntityManager, FakeMessage} from '../fakes';

jest.mock('../../src/models/session');

const CHANNEL_ID = '12345';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('session recorder', () => {
  const mockSession = new Session();
  const fakeChannel = new FakeTextChannel(CHANNEL_ID);
  const fakeManager = new FakeEntityManager();

  let recorder: SessionRecorder;
  beforeEach(() => {
    mockSession.channelId = CHANNEL_ID;
    fakeManager.save(mockSession);
    fakeManager._clearSavedEntities();
    recorder = new SessionRecorder(mockSession, fakeChannel, fakeManager);
  });

  // Helpers
  const getFakeCollector = (channel: FakeTextChannel, nth: number = 0) =>
    channel.createMessageCollector.mock.results[nth].value;

  describe('start', () => {
    it('should create a new message collector for channel', () => {
      recorder.start();

      expect(fakeChannel.createMessageCollector).toHaveBeenCalled();
    });

    it('should register a callback for ending message collection', () => {
      recorder.start();

      const fakeCollector = getFakeCollector(fakeChannel);
      expect(fakeCollector).toBeDefined();
      expect(fakeCollector.on).toHaveBeenCalledTimes(1);
      expect(fakeCollector.on.mock.calls[0][0]).toBe('end');
    });

    it('should throw an error if channel IDs do not match', () => {
      mockSession.channelId = CHANNEL_ID + 'foo';

      expect(() => {
        recorder.start();
      }).toThrow(Error);
    });

    it('should throw an error if already recording', () => {
      recorder.start();
      fakeChannel.createMessageCollector.mockClear();

      expect(() => {
        recorder.start();
      }).toThrow(Error);

      expect(fakeChannel.createMessageCollector).not.toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('should stop the message collector', async () => {
      expect.assertions(1);
      recorder.start();

      await recorder.stop();

      const fakeCollector = getFakeCollector(fakeChannel);
      expect(fakeCollector.stop).toHaveBeenCalled();
    });

    it('should save all messages as posts', async () => {
      // TODO: Make this work better with the objects used across multiple tests
      // Setup some messages on the channel to be saved
      const messages = ['test-1', 'test-2', 'test-3'];
      fakeChannel.messages = messages.map(content => new FakeMessage(content));

      expect.assertions(1 + messages.length * 2);

      recorder.start();

      await recorder.stop();

      expect(fakeManager.savedEntities.length).toBe(messages.length);
      messages.forEach((content, n) => {
        const entity = fakeManager.savedEntities[n];

        expect(entity).toBeInstanceOf(Post);
        expect((entity as Post).content).toEqual(content);
      });

      fakeChannel.messages = [];
    });

    it('should not do anything if not started', async () => {
      expect.assertions(2);
      expect(fakeChannel.createMessageCollector).not.toHaveBeenCalled();

      await recorder.stop();

      // We assume that collector.stop was not called b/c it doesn't exist
      expect(fakeManager.savedEntities.length).toBe(0);
    });
  });
});
