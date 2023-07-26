import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from '../dto/send-email.dto';
import { EmailJob } from 'src/database/entities/email-job.entity';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-emails')
  async sendEmails(@Body() sendEmailDto: SendEmailDto): Promise<EmailJob[]> {
    console.log('api-gateway : controller :   console.log(sendEmailDto);');
    console.log(sendEmailDto);
    const { userId, numberOfEmails } = sendEmailDto;
    const emailJob = await this.emailService.sendEmails(userId, numberOfEmails);
    return new Array(emailJob);
  }

  @Get('/:userId')
  getInCompleteEmailJobs(@Param('userId') userId: string): Promise<EmailJob[]> {
    const emailJobs = this.emailService.getInCompleteEmailJobsByUserId(userId);
    return emailJobs;
  }

  @Get('/:userId/completed')
  getCompletedEmailJobs(@Param('userId') userId: string): Promise<EmailJob[]> {
    const emailJobs = this.emailService.getCompletedEmailJobsByUserId(userId);
    return emailJobs;
  }
}
