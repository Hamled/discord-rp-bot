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
    const session = context.session;
    if(!session) {
      console.log(`Attempted to stop a session on channel ${context.channel.id} ` +
                  `when no session was active.`);
      return context;
    }

    // Set the end date for the current session
    session.endDate = new Date();
  }
}
