import { SelectOption } from "@/types/SelectOption";

export const moduleName = "users";
export interface User {
  id?: number;
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  role?: string[];
  photo?: string;
  status?: 0 | 1;
}

export interface UserListModel {
  id: string;
  username: string;
  email: string;
  status: 0 | 1;
}

export interface CreateModel {
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  password?: string;
  role?: string[];
  status?: 0 | 1;
}

export interface SubmitCreateUserModel {
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  password?: string;
  role?: string[];
  status?: 0 | 1;
}

export interface UpdateUserModel {
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  role?: string[];
  photo?: string;
  status?: 0 | 1;
}

export interface UpdateUserProfileModel {
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  role?: string[];
  photo?: string;
  status?: 0 | 1;
}

export interface SubmitUpdateUserModel {
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  role?: string[];
  status?: 0 | 1;
}

export interface DetailUserModel {
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  password?: string;
  role?: SelectOption;
  status?: 0 | 1;
}

export interface ReadUserModel {
  id: string | number;
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  role?: string;
  status?: 0 | 1;
}
