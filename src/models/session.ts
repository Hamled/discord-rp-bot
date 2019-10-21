import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';

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
}
