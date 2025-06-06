import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Benvenuto in AutoRia Clone!';
  }
}
