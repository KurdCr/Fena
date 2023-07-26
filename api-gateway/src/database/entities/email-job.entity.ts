import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { JobStatus } from '../../interfaces/jobStatus';

@Entity()
export class EmailJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  totalEmails: number;

  @Column({ default: 0 })
  emailsSent: number;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.IN_PROGRESS })
  status: JobStatus;

  constructor(id: string, userId: string, totalEmails: number) {
    this.id = id;
    this.userId = userId;
    this.totalEmails = totalEmails;
    this.emailsSent = 0;
    this.status = JobStatus.IN_PROGRESS;
  }

  toString() {
    return JSON.stringify({
      id: this.id,
      userId: this.userId,
      totalEmails: this.totalEmails,
      emailsSent: this.emailsSent,
      status: this.status,
    });
  }
}
