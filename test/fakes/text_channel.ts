import {TextChannel} from 'discord.js';
import {FakeGuild} from './guild';

export class FakeTextChannel extends TextChannel {
  constructor(id?: string) {
    super(new FakeGuild(), {
      id: id || ''
    });
  }
}
