import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot(): string {
    return 'use api/v1/{reports, transactions}/api_name';
  }
}
