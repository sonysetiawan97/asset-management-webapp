import { RolePrivilegeItem } from "@modules/roles/types/Model";

export interface AuthModel {
    id?: number;
    first_name?: string;
    last_name?: string;
    username: string;
    email: string;
    role: RolePrivilegeItem;
    status?: 0 | 1;
}