import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailJob } from './entities/email-job.entity';
import { DeadLetterQueue } from './entities/dead-letter-queue.entity';
import { JobStatus } from 'src/interfaces/jobStatus';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(EmailJob)
    private readonly emailJobRepository: Repository<EmailJob>,
    private readonly DtqRepository: Repository<DeadLetterQueue>,
  ) {}

  getEmails(jobId: string) {
    // Here we make a query to the database to retrieve emails from the database
    return ['email1@example.com', 'email2@example.com'];
  }

  getInCompleteEmailJobs(): Promise<EmailJob[]> {
    return this.emailJobRepository
      .createQueryBuilder('emailJob')
      .where('emailJob.emailsSent != emailJob.totalEmails')
      .getMany();
  }

  addMessageToDlq(dtqId: string, value: Buffer, topic: any) {
    const emailJob = new DeadLetterQueue(dtqId, value, topic);
    this.DtqRepository.save(emailJob);
  }

  async updateEmailsSent(id: string, emailsSent: number): Promise<void> {
    const job = await this.emailJobRepository.findOne({ where: { id } });
    if (job) {
      job.emailsSent = emailsSent;
      await this.emailJobRepository.save(job);
    }
  }

  async updateEmailJobStatus(id: string, status: JobStatus) {
    const job = await this.emailJobRepository.findOne({ where: { id } });
    if (job) {
      job.status = status;
      await this.emailJobRepository.save(job);
    }
  }
}
