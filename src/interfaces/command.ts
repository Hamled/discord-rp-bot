import {MsgContext} from './msg_context';

export interface Command {
  matches(name: string): boolean;
  process(context: MsgContext, ...args: string[]): Promise<MsgContext>;
}
