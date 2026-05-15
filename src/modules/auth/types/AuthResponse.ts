import type { User } from "@/modules/users/types/UserTypes";
import { RolePrivilege } from "@modules/roles/types/Model";

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
  role?: RolePrivilege;
}
