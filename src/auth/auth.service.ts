import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { UserRoleEntity } from '../user/entity/user-role.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepo: Repository<UserRoleEntity>,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, displayName: string) {
    const user = await this.userRepo.findOne({ where: { email: email } });
    if (user && !user.isEnabled) {
      return null;
    }

    if (user) {
      return user;
    }

    // Create new user only if from whitelisted domain
    const emailDomain = email.split('@').pop();
    if (
      !this.configService
        .get('AUTH_EMAIL_DOMAIN_WHITELIST')
        .split(',')
        .includes(emailDomain)
    ) {
      return null;
    }

    //In case of DEFAULT_USER_ROLE is not set, user will be registered without any role
    const roles = await this.userRoleRepo.find({
      where: { name: this.configService.get('DEFAULT_USER_ROLE') },
    });

    //Register anyone on their first sign-in
    const newUser = this.userRepo.create({ email, displayName, roles });
    await this.userRepo.save(newUser);
    return newUser;
  }

  async findUser(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (user && !user.isEnabled) {
      return null;
    }
    return user?.id || null;
  }
}
