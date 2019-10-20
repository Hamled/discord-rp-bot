import {EntityManager} from 'typeorm';
import {Command} from '../command';
import {Session} from '../../models/session';

export class StartCommand implements Command {
  constructor(private readonly manager: EntityManager) {
  }

  matches(name: string): boolean {
    return name === 'start';
  }

  async process(...args: string[]): Promise<void> {
    const sess = new Session();
    await this.manager.save(sess);

    console.log(`Starting new session with id ${sess.id}`);
  }
}
