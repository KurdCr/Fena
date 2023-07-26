import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaConsumerModule } from './kafka-consumer/kafka-consumer.module';
import { KafkaProducerModule } from './kafka-producer/kafka-producer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import mysqlConfig from 'src/config/mysql.config';
import { DatabaseModule } from './database/database.module';
import { EmailProcessingService } from './email-processing.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forRoot(mysqlConfig),
    KafkaProducerModule,
    KafkaConsumerModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'MAIN_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'main',
            brokers: [new ConfigService().get('KAFKA_BROKER')],
          },
          consumer: {
            groupId: 'main-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, EmailProcessingService],
})
export class AppModule {
}
