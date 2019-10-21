import {Channel} from 'discord.js';
import {Session} from '../models/session';

export interface MsgContext {
  channel: Channel;
  session?: Session;
}
