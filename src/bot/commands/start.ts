import {EntityManager} from 'typeorm';
import {Session} from '../../models';
import {MsgContext, Command} from '../../interfaces';
import {SessionRecorder} from '../session_recorder';

export class StartCommand implements Command {
  constructor(private readonly manager: EntityManager) {
  }

  matches(name: string): boolean {
    return name === 'start';
  }

  async process(context: MsgContext, ..._args: string[]): Promise<MsgContext> {
    if(context.session) {
      console.log(`Attempted to start a session on channel ${context.channel.id} ` + 
                  `when one was already active (id ${context.session.id})`);
      return context;
    }

    const session = new Session();
    session.channelId = context.channel.id;
    await this.manager.save(session);

    const recorder = context.recorder || new SessionRecorder(session, context.channel, this.manager);
    recorder.start();

    console.log(`Starting new session with id ${session.id} on channel ${session.channelId}`);
    return {...context, session, recorder};
  }
}
