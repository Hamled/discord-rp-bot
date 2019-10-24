import {MessageCollector,
        MessageCollection,
        CollectorCallback,
        EndEventCallback} from '../../src/interfaces';
import {Message, TextChannel} from '../../src/interfaces';

export class FakeMessageCollector implements MessageCollector {
  private callbacks: Map<string, CollectorCallback> = new Map<string, CollectorCallback>();
  private readonly messages: Message[];

  public on: jest.Mock<void, [string, CollectorCallback]>;
  public stop: jest.Mock<void, [string?]>;

  constructor(public readonly channel: TextChannel,
              messages?: Message[]) {
    this.messages = messages || [];

    this.on = jest.fn<void, [string, CollectorCallback]>((event, cb) => {
      this.callbacks.set(event, cb);
    });

    this.stop = jest.fn<void, [string?]>((reason = 'user') => {
      const cb = this.callbacks.get('end');
      if(cb != undefined) {
        const endCb: EndEventCallback = cb as EndEventCallback;
        endCb(this.makeCollection(this.messages), reason);
      }
    });
  }

  private makeCollection(messages: Message[]): MessageCollection {
    return new Map<string, Message>(messages.map(m => [m.id, m]));
  }
}
