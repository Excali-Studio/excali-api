import { HttpException, HttpStatus } from '@nestjs/common';

export class GoogleException extends HttpException {
  constructor() {
    super('GOOGLE_AUTH_FAILED', HttpStatus.FORBIDDEN);
  }
}
