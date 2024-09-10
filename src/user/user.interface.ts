import { ApiProperty } from '@nestjs/swagger';

export class UserMeDTO {
  @ApiProperty({ example: 'f952a65a-8b3f-4c3e-b53d-ced019820044' })
  uid: string;
  displayName: string;
  @ApiProperty({ isArray: true, type: () => UserRoleDTO })
  roles: UserRoleDTO[];
}

export interface User {
  id: string;
  email: string;
  displayName: string;
}

export class UserRoleDTO {
  @ApiProperty({ example: 'admin' })
  name: string;
}
