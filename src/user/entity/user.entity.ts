import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserRoleEntity } from './user-role.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
@Unique(['email'])
export class UserEntity {
  @ApiProperty({ example: 'b28c8e5a-9999-4bcd-84f3-211790740933' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  displayName: string;

  @ApiProperty()
  @Column({
    default: true,
  })
  isEnabled: boolean;

  @ApiProperty({ isArray: true, type: () => UserRoleEntity })
  @ManyToMany(() => UserRoleEntity)
  @JoinTable({
    name: 'user_roles',
  })
  roles: UserRoleEntity[];

  constructor(id: string) {
    this.id = id;
  }

  //@TODO add date created and modified
}
