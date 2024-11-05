export interface UserMeDTO {
  uid: string;
  displayName: string;
  roles: UserRoleDTO[];
}

export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface UserRoleDTO {
  name: string;
}
