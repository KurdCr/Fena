import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EmailProcessingService } from './email-processing.service';
import { EmailJob } from './database/entities/email-job.entity';

@Controller()
export class AppController {
  constructor(
    private readonly emailProcessingService: EmailProcessingService,
  ) { }
  
  @MessagePattern('send_emails')
  getUser(emailJob: EmailJob) {
    this.emailProcessingService.processJob(emailJob);
    return emailJob;
  }
}
