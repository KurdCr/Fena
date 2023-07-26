import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ConsumerService],
  exports: [ConsumerService],
})
export class KafkaConsumerModule {}
