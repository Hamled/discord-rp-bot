import {TextChannel} from 'discord.js';
import {MsgContext} from '../../src/bot/msg_context';
import {Session} from '../../src/models/session';
import {FakeTextChannel} from './text_channel';

export class FakeMsgContext implements MsgContext {
  channel: TextChannel;
  session?: Session;

  constructor(channelId?: string, session?: Session) {
    this.channel = new FakeTextChannel(channelId),
    this.session = session;
  }
}
