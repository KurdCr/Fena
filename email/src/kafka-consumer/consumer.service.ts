import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConsumerConfig, ConsumerSubscribeTopics, KafkaMessage } from 'kafkajs';
// import { DatabaseService } from '../database/database.service';
import { IConsumer } from './consumer.interface';
import { KafkajsConsumer } from './kafkajs.consumer';
import { DatabaseService } from 'src/database/database.service';

interface KafkajsConsumerOptions {
  topics: ConsumerSubscribeTopics;
  config: ConsumerConfig;
  onMessage: (message: KafkaMessage) => Promise<any>;
}

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumers: IConsumer[] = [];
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) { }

  async consume({ topics, config, onMessage }: KafkajsConsumerOptions) {
    const consumer = new KafkajsConsumer(
      topics,
      this.databaseService,
      config,
      this.configService.get('KAFKA_BROKER'),
    );
    await consumer.connect();
    await consumer.consume(onMessage);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
