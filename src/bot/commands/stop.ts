import {EntityManager} from 'typeorm';
import {Command} from '../command';
import {MsgContext} from '../msg_context';

export class StopCommand implements Command {
  constructor(private readonly manager: EntityManager) {
  }

  matches(name: string): boolean {
    return name === 'stop';
  }

  async process(context: MsgContext, ...args: string[]): Promise<MsgContext> {
    if(!context.session) {
      console.log(`Attempted to stop a session on channel ${context.channel.id} ` +
                  `when no session was active.`);
      return context;
    }
  }
}
