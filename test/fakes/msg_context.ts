import {Channel} from 'discord.js';
import {MsgContext} from '../../src/bot/msg_context';
import {Session} from '../../src/models/session';
import {FakeChannel} from './channel';

export class FakeMsgContext implements MsgContext {
  channel: Channel;
  session?: Session;

  constructor(channelId?: string, session?: Session) {
    this.channel = new FakeChannel(channelId),
    this.session = session;
  }
}
