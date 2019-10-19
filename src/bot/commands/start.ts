import {Command} from '../command';

export class StartCommand implements Command {
  matches(name: string): boolean {
    return name === 'start';
  }

  process(...args: string[]): void {
  }
}
