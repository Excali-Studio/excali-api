import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard';
import { UserMeDTO } from './user.interface';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthenticatedGuard)
  @ApiOkResponse({type: UserMeDTO})
  public async getUserMe(@Req() req: Request): Promise<UserMeDTO> {
    console.log('req', req.sessionStore);

    const user = await this.userService.readById(req.user.toString());

    return {
      uid: user.id,
      roles: user.roles,
    };
  }
}
