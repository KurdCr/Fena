import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import mysqlConfig from './config/mysql.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaConsumerModule } from './kafka-consumer/kafka-consumer.module';
import { KafkaProducerModule } from './kafka-producer/kafka-producer.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    KafkaConsumerModule,
    KafkaProducerModule,
    TypeOrmModule.forRoot(mysqlConfig),
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'email',
            brokers: [new ConfigService().get('KAFKA_BROKER')],
          },
          consumer: {
            groupId: 'email-consumer',
          },
        },
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    EmailModule,
  ],
  exports: [AppModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
