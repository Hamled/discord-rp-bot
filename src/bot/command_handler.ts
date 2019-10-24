import {Command} from './command';
import {MsgContext} from '../interfaces';

export class CommandHandler {
  constructor(private readonly commands: Command[]) {
  }

  async handle(msg: string, context: MsgContext): Promise<MsgContext> {
    const [cmdName, ...cmdArgs] = this.parseCmd(msg);
    if (!cmdName) return context;

    const cmds = this.commands
      .filter(cmd => cmd.matches(cmdName));

    if(cmds.length > 1) {
      throw new Error(`Multiple commands matched '${cmdName}: ${cmds}`);
    }

    return cmds.map(async cmd => await cmd.process(context, ...cmdArgs))[0] || context;
  }

  private parseCmd(msg: string): string[] {
    if (!msg.startsWith('!')) return [];
    return msg.substring(1).split(' ');
  }
}
