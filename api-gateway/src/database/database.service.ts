import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailJob } from './entities/email-job.entity';
import { DeadLetterQueue } from './entities/dead-letter-queue.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(EmailJob)
    private readonly emailJobRepository: Repository<EmailJob>,
    private readonly DtqRepository: Repository<DeadLetterQueue>,
  ) { }

  getInCompleteEmailJobsByUserId(userId: string): Promise<EmailJob[]> {
    return this.emailJobRepository
      .createQueryBuilder('emailJob')
      .where(
        `emailJob.emailsSent != emailJob.totalEmails && emailJob.userId = ${userId}`,
      )
      .getMany();
  }

  getCompletedEmailJobsByUserId(userId: string): Promise<EmailJob[]> {
    return this.emailJobRepository
      .createQueryBuilder('emailJob')
      .where(
        `emailJob.emailsSent = emailJob.totalEmails && emailJob.userId = ${userId}`,
      )
      .getMany();
  }

  addMessageToDlq(dtqId: string, value: Buffer, topic: any) {
    const emailJob = new DeadLetterQueue(dtqId, value, topic);
    this.DtqRepository.save(emailJob);
  }

  async createEmailJob(
    emailJobId: string,
    userId: string,
    totalEmails: number,
  ): Promise<EmailJob> {
    const emailJob = new EmailJob(emailJobId, userId, totalEmails);
    return this.emailJobRepository.save(emailJob);
  }
}
