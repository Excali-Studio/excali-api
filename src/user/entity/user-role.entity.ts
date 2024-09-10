import { Entity, PrimaryColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_role')
@Unique(['name'])
export class UserRoleEntity {
  @ApiProperty()
  @PrimaryColumn()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
