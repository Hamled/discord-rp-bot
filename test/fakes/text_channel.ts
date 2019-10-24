import {TextChannel, Message, MessageCollector, CollectorFilter} from '../../src/interfaces';
import {FakeMessageCollector} from './message_collector';

export class FakeTextChannel implements TextChannel {
  public readonly id: string;
  public messages: Message[];

  createMessageCollector: jest.Mock<MessageCollector, [CollectorFilter, object?]>;

  constructor(id?: string, messages?: Message[]) {
    this.id = id || 'channel-12345';
    this.messages = messages || [];

    this.createMessageCollector = jest.fn<MessageCollector, [CollectorFilter, object?]>(
      (_filter: CollectorFilter, _options?: object) => {
        return new FakeMessageCollector(this, this.messages);
      });
  }
}
