import {EntityManager} from 'typeorm';
import {Message, MessageCollector, TextChannel, MessageCollection} from '../interfaces';
import {Session, Post} from '../models';

export class SessionRecorder {
  private static messageFilter = (m: Message) => true;
  private static RECORD_TIME = 60 * 60 * 8 * 1000; // 8 hours

  private collector?: MessageCollector;
  private collectionPromise?: Promise<MessageCollection>;

  constructor(private readonly session: Session,
              private readonly channel: TextChannel,
              private readonly manager: EntityManager) {
  }

  start(): void {
    //TODO: Figure out a better way to handle this, since we have the channel ID already
    if(this.channel.id !== this.session.channelId) {
      throw new Error(`Tried to record session #${this.session.id} on channel ` +
                      `#${this.channel.id} but it is assigned to channel ` +
                      `#${this.session.channelId}`);
    }

    if(this.collector != undefined) {
      throw new Error(`Tried to record session #{this.session.id} but it was ` +
                      `already recording.`);
    }

    this.collector = this.channel.createMessageCollector(SessionRecorder.messageFilter, {
      time: SessionRecorder.RECORD_TIME
    });

    this.collectionPromise = new Promise<MessageCollection>((resolve, reject) => {
      if(this.collector == undefined) {
        reject('Lost message collector somehow');
        return;
      }

      this.collector.on('end', (collected: MessageCollection, reason: string) => {
        console.log(`Session #${this.session.id} recording stopped for reason: ${reason}`);
        resolve(collected);
      });
    });
  }

  async stop(): Promise<void> {
    if(!this.collector) return;

    this.collector.stop();

    if(this.collectionPromise) {
      const collected = await this.collectionPromise;
      await this.recordComplete(collected);
    }

    delete this.collectionPromise;
    delete this.collector;
  }

  private async recordComplete(collected: MessageCollection): Promise<void> {
    const posts = [...collected.values()].map((msg: Message) => new Post(this.session, msg));
    await this.manager.save(posts);

    if(this.session.posts == undefined) this.session.posts = [];
    this.session.posts.concat(posts);
  }
}
