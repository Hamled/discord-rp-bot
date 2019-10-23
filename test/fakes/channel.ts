import {Channel} from 'discord.js';
import {FakeClient} from './client';

export class FakeChannel extends Channel {
  constructor(id?: string) {
    super(new FakeClient(), {
      id: id || ''
    });
  }
}
