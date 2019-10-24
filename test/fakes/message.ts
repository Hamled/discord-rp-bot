import {Message} from '../../src/interfaces';

type Author = {id: string};

export class FakeMessage implements Message {
  public readonly id: string;
  public readonly author: Author;
  public readonly content: string;
  public readonly createdAt: Date;
  public readonly editedAt?: Date;

  private static numFakes: number = 12345;

  constructor(content?: string) {
    this.id = FakeMessage.makeMessageId();
    this.author = {id: FakeMessage.makeUserId()};
    this.content = content || '';
    this.createdAt = new Date();
  }

  private static makeMessageId(): string {
    const id = this.numFakes;
    this.numFakes += 1;

    return `msg-${id}`;
  }

  // TODO: Make this not match the message id...
  private static makeUserId(): string {
    const id = this.numFakes;
    return `user-${id}`;
  }
}
