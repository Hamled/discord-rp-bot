import {TextChannel} from '../../src/interfaces';

export class FakeTextChannel implements TextChannel {
  public readonly id: string;

  constructor(id?: string) {
    this.id = id || 'channel-12345';
  }
}
