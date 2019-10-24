import {TextChannel} from '../interfaces';
import {Session} from '../models';
import {SessionRecorder} from './session_recorder';

export interface MsgContext {
  channel: TextChannel;
  session?: Session;
  recorder?: SessionRecorder;
}
