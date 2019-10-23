import {TextChannel} from 'discord.js';
import {Session} from '../models';

export interface MsgContext {
  channel: TextChannel;
  session?: Session;
}
