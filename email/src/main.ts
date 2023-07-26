import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [new ConfigService().get('KAFKA_BROKER')],
        },
        consumer: {
          groupId: 'main-consumer',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
