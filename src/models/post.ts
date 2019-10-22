import {Message} from 'discord.js';
import {Entity, Column, PrimaryColumn, ManyToOne} from 'typeorm';
import {Session} from './session';

@Entity()
export class Post {
  constructor(session: Session, msg: Message) {
    this.id = msg.id;
    this.session = session;

    this.constructFromMessage(msg);
  }

  @PrimaryColumn()
  id: string;

  @ManyToOne(type => Session, session => session.posts)
  session: Session;

  @Column('varchar', {length: 24})
  authorId: string;

  @Column('text')
  content: string;

  @Column('datetime')
  createdAt: Date;

  @Column('datetime')
  editedAt: Date;

  private constructFromMessage(msg: Message): void {
    this.authorId = msg.author.id;
    this.content = msg.content;
    this.createdAt = msg.createdAt;
    this.editedAt = msg.editedAt;
  }
}
