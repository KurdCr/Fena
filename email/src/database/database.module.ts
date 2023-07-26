import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import mysqlConfig from '../config/mysql.config';
import { EmailJob } from './entities/email-job.entity';
import { DeadLetterQueue } from './entities/dead-letter-queue.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailJob]),
    TypeOrmModule.forFeature([DeadLetterQueue]),
    TypeOrmModule.forRoot(mysqlConfig),
  ],
  providers: [DatabaseService, Repository],
  exports: [DatabaseService],
})
export class DatabaseModule { }
