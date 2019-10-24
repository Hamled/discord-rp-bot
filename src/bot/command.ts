import {MsgContext} from '../interfaces';

export interface Command {
  matches(name: string): boolean;
  process(context: MsgContext, ...args: string[]): Promise<MsgContext>;
}
