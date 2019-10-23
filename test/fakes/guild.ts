import {Guild} from 'discord.js';
import {FakeClient} from './client';

export class FakeGuild extends Guild {
  constructor() {
    super(new FakeClient(), {
      emojis: []
    });
  }
}
