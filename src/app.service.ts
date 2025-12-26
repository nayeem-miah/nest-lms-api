import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      success: true,
      message: 'Hello learning management server!',
      date: new Date(),
      version: '1.0.0',
      status: 200,
    };
  }
}
