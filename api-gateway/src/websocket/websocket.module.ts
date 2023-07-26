import { Module } from '@nestjs/common';
import { AppWebSocketGateway } from './websocket.gateway';
import { KafkaConsumerModule } from 'src/kafka-consumer/kafka-consumer.module';
@Module({
  imports: [KafkaConsumerModule],
  providers: [AppWebSocketGateway],
  exports: [AppWebSocketGateway],
})
export class WebSocketModule { }
