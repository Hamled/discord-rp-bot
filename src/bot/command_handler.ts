import {Command} from './command';
import {MsgContext} from './msg_context';

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

  private parseCmd(msg: string): string[] | null[] {
    if (!msg.startsWith('!')) return [null];
    return msg.substring(1).split(' ');
  }
}
