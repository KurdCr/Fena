import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProducerService } from './kafka-producer/producer.service';
import { EmailJob } from './database/entities/email-job.entity';
import { JobStatus } from './interfaces/jobStatus';

@Injectable()
export class EmailProcessingService implements OnModuleInit {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly producerService: ProducerService,
  ) { }

  async onModuleInit(): Promise<void> {
    // Retrieve all incomplete email jobs from the database
    // This step is essential to handle scenarios such as server shutdown, crashes, or insufficient emails
    // When the application starts or restarts, incomplete email jobs will be picked up again to resume processing
    // Ensures no email job is lost or left incomplete, providing fault tolerance and graceful recovery
    const emailJobs = await this.databaseService.getInCompleteEmailJobs();
    console.log('List of all incomplete email jobs' + emailJobs);
    for (const job of emailJobs) {
      this.processJob(job);
    }
  }

  async processJob(emailJob: EmailJob): Promise<void> {
    // Get emails from the database
    const emails = await this.databaseService.getEmails(emailJob.id);

    for (let i = 0; i < emails.length; i++) {
      emailJob.emailsSent += 1;
      await this.sendEvent(emailJob);
    }
    //This while loop is for testing only, just to finish the simulation
    while (emailJob.emailsSent < emailJob.totalEmails) {
      emailJob.emailsSent += 1;
      await this.sendEvent(emailJob);
    }
    // Mark the job as completed when all emails are sent
    if (emailJob.emailsSent == emailJob.totalEmails) {
      await this.databaseService.updateEmailJobStatus(
        emailJob.id,
        JobStatus.COMPLETED,
      );
    }
  }

  async sendEvent(emailJob: EmailJob) {
    //  Simulate a delay to mimic email sending
    await new Promise((r) => setTimeout(r, 1000));
    // Produce the emailJob_updates event in Kafka
    await this.producerService.produce('emailJob_updates', {
      value: JSON.stringify(emailJob),
    });

    // Update the emailsSent value in the database for tracking progress
    await this.databaseService.updateEmailsSent(
      emailJob.id,
      emailJob.emailsSent,
    );
    console.log('kafka ' + JSON.stringify(emailJob));
  }
}
