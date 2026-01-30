export interface UsersResponse {
  users: User[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}
