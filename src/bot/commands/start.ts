import {EntityManager} from 'typeorm';
import {Command} from '../command';
import {Session} from '../../models/session';
import {MsgContext} from '../msg_context';

export class StartCommand implements Command {
  constructor(private readonly manager: EntityManager) {
  }

  matches(name: string): boolean {
    return name === 'start';
  }

  async process(context: MsgContext, ...args: string[]): Promise<void> {
    const sess = new Session();
    sess.channelId = context.channel.id;
    await this.manager.save(sess);

    console.log(`Starting new session with id ${sess.id} on channel ${sess.channelId}`);
  }
}
