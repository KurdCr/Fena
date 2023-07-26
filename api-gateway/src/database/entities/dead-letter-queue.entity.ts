import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeadLetterQueue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: Buffer;

  @Column()
  topic: string;

  constructor(id: string, value: Buffer, topic: string) {
    this.id = id;
    this.value = value;
    this.topic = topic;
  }

  toString() {
    return JSON.stringify({
      id: this.id,
      value: this.value,
      topic: this.topic,
    });
  }
}
