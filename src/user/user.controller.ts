import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User, UserMeDTO } from './user.interface';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthenticatedGuard)
  @ApiOkResponse({ type: UserMeDTO })
  public async getUserMe(@Req() req: Request): Promise<UserMeDTO> {
    console.log('req', req.sessionStore);

    const user = await this.userService.readById(req.user.toString());

    return {
      uid: user.id,
      roles: user.roles,
      displayName: user.displayName,
    };
  }

  @Get('users')
  @UseGuards(AuthenticatedGuard)
  public async readAllUsers(): Promise<Omit<User, 'displayName'>[]> {
    const users = await this.userService.getUsers();
    return users.map((elem) => ({
      id: elem.id,
      email: elem.email,
    }));
  }
}
