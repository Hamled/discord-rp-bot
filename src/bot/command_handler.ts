import {Command} from './command';

export class CommandHandler {
  constructor(private readonly commands: Command[]) {
  }

  handle(msg: string): void {
    const [cmdName, ...cmdArgs] = this.parseCmd(msg);
    if (!cmdName) return;

    const cmds = this.commands
      .filter(cmd => cmd.matches(cmdName));

    if(cmds.length > 1) {
      throw new Error(`Multiple commands matched '${cmdName}: ${cmds}`);
    }

    cmds.forEach(cmd => {
      cmd.process(...cmdArgs);
    });
  }

  private parseCmd(msg: string): string[] | null[] {
    if (!msg.startsWith('!')) return [null];
    return msg.substring(1).split(' ');
  }
}
