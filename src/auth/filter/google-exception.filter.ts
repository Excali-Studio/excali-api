import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { GoogleException } from '../exception/google.exception';
import { ConfigService } from '@nestjs/config';

@Catch(GoogleException)
export class GoogleExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const redirectUrl = this.configService.get<string>(
      'FRONT_APP_REDIRECT_URL',
    );
    const failRedirectUrl =
      this.configService.get<string>('FRONT_APP_REDIRECT_FAIL') ?? '/no-access';

    response.redirect(`${redirectUrl}${failRedirectUrl}`);
  }
}
