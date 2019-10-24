import {TextChannel} from '../interfaces';
import {Session} from '../models';

export interface MsgContext {
  channel: TextChannel;
  session?: Session;
}
