import {
  ExceptionFilter,
  HttpException,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';

import { Response } from 'express';

@Catch(HttpException)
export class UnauthorizedUserExceptionHandler implements ExceptionFilter {
  catch(_exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    return response.redirect(`${process.env.FRONT_APP_REDIRECT_URL}/no-access`);
  }
}
