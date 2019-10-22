import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany} from 'typeorm';
import {Post} from './post';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {length: 24})
  channelId: string;

  @CreateDateColumn()
  startDate: Date;

  @Column('datetime', {nullable: true})
  endDate: Date;

  @OneToMany(type => Post, post => post.session)
  posts: Post[];
}
