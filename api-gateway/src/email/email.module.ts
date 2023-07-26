import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { KafkaConsumerModule } from 'src/kafka-consumer/kafka-consumer.module';
import { KafkaProducerModule } from 'src/kafka-producer/kafka-producer.module';
import { WebSocketModule } from 'src/websocket/websocket.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    WebSocketModule,
    KafkaConsumerModule,
    KafkaProducerModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule { }
