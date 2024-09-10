import {
  Controller,
  Delete,
  Get,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from './guard/google.guard';
import { Request, Response } from 'express';
import { User } from '../user/user.interface';
import { GoogleExceptionFilter } from './filter/google-exception.filter';
import { ApiTags, ApiResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleGuard)
  @Get('google/login')
  @ApiResponse({ status: 302, description: 'Redirect do Google' })
  public handlerLogin() {}

  @UseGuards(GoogleGuard)
  @UseFilters(GoogleExceptionFilter)
  @Get('google/redirect')
  @ApiResponse({ status: 302, description: 'Redirect to frontend application' })
  public handlerRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    res.redirect(`${process.env.FRONT_APP_REDIRECT_URL}?userId=${user.id}`);
  }

  @Get('status')
  @ApiOkResponse({
    description: 'Returns authentication status and user details if logged in',
  })
  public user(@Req() req: Request) {
    if (req.user) {
      return { message: 'Authenticated', user: req.user };
    } else {
      return { message: 'Not Authenticated' };
    }
  }

  @Delete('logout')
  @ApiOkResponse({ description: 'User has been logged out' })
  public logout(@Req() req: Request) {
    req.logout({ keepSessionInfo: false }, () => {});
  }
}
