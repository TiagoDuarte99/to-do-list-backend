export interface User {
  id: number;
  email: string;
  name: string;
  active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserAuths {
  email: string;
  password: string;
}

export interface UserCreate {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface UserUpdate {
  email?: string;
  name?: string;
  active?: boolean;
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface PasswordUpdate {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserToken {
  user: User;
  token: string;
}
