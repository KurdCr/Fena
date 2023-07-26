import { Injectable } from '@nestjs/common';
import { ConsumerService } from './kafka-consumer/consumer.service';

@Injectable()
export class AppService {
  constructor(private readonly consumerService: ConsumerService) { }

  async onModuleInit() {
    // Instead of handling WebSocket events through the controller, a consumer pattern could be used.
    // The decision of whether to use the controller or consumer pattern should take other factors into consideration,
    // such as scalability, code organization, and maintaining consistency throughout the code base.

    // await this.consumerService.consume({
    //   topics: { topics: ['send_emails'] },
    //   config: { groupId: 'email-consumer' },
    //   onMessage: async (message) => {
    //     console.log({
    //       value: message.value.toString(),
    //     });
    //     return message.value.toString();
    //   },
    // });
  }
}
