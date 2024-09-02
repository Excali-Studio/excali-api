import { Controller, Delete, Get, Req, Res, UseGuards, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from './guard/google.guard';
import { Request, Response } from 'express';
import { User } from '../user/user.interface';
import { UnauthorizedUserExceptionHandler } from 'src/auth/unauthorized-user-exception-handler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleGuard)
  @Get('google/login')
  public handlerLogin() {}

  @UseGuards(GoogleGuard)
  @Get('google/redirect')
  @UseFilters(UnauthorizedUserExceptionHandler)
  public handlerRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    res.redirect(`${process.env.FRONT_APP_REDIRECT_URL}?userId=${user.id}`);
  }

  @Get('status')
  public user(@Req() req: Request) {
    if (req.user) {
      return { message: 'Authenticated', user: req.user };
    } else {
      return { message: 'Not Authenticated' };
    }
  }

  @Delete('logout')
  public logout(@Req() req: Request) {
    req.logout({ keepSessionInfo: false }, () => {});
  }
}
