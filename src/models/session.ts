import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  startDate: Date;

  @Column('datetime', {nullable: true})
  endDate: Date;
}
