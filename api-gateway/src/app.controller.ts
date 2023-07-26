import { Controller } from '@nestjs/common';

@Controller('email')
export class AppController {
  getHello(): any {
    return 'Hello World!';
  }
}
