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
    let session = context.session;
    if(session == undefined) {
      session = new Session();
      session.channelId = context.channel.id;
      await this.manager.save(session);
    }

    const recorder = context.recorder || new SessionRecorder(session, context.channel, this.manager);
    recorder.start();

    console.log(`Starting new session with id ${session.id} on channel ${session.channelId}`);
    return {...context, session, recorder};
  }
}
