import {MsgContext, TextChannel} from '../../src/interfaces';
import {Session} from '../../src/models/session';
import {SessionRecorder} from '../../src/bot/session_recorder';
import {FakeTextChannel} from './text_channel';

export class FakeMsgContext implements MsgContext {
  channel: TextChannel;
  session?: Session;
  recorder?: SessionRecorder;

  constructor(channelId?: string, session?: Session, recorder?: SessionRecorder) {
    this.channel = new FakeTextChannel(channelId),
    this.session = session;
    this.recorder = recorder;
  }
}
