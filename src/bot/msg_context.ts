import {Channel} from 'discord.js';
import {Session} from '../models';

export interface MsgContext {
  channel: Channel;
  session?: Session;
}
