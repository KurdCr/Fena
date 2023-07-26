import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { ProducerService } from 'src/kafka-producer/producer.service';
import { EmailJob } from '../database/entities/email-job.entity';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly databaseService: DatabaseService,
  ) { }

  async getInCompleteEmailJobsByUserId(userId: string): Promise<EmailJob[]> {
    const emailJobs = await this.databaseService.getInCompleteEmailJobsByUserId(
      userId,
    );
    return emailJobs;
  }

  async getCompletedEmailJobsByUserId(userId: string): Promise<EmailJob[]> {
    const emailJobs = await this.databaseService.getCompletedEmailJobsByUserId(
      userId,
    );
    return emailJobs;
  }

  async sendEmails(userId: string, numberOfEmails: number): Promise<EmailJob> {
    const jobId = v4();
    const emailJob = new EmailJob(jobId, userId, numberOfEmails);
    await this.producerService.produce('send_emails', {
      value: emailJob.toString(),
    });

    this.databaseService.createEmailJob(
      emailJob.id,
      emailJob.userId,
      emailJob.totalEmails,
    );
    console.log('created');
    return emailJob;
  }
}
