import { Model as Privileges } from '../../privileges/types/Model';

export const moduleName = "roles";

export interface Model {
    id: string;
    code?: string;
    name: string;
}

export interface CreateModel {
    id?: string;
    code?: string;
    name: string;
    privileges?: PrivilegePayload[];
}

export interface ReadModel {
    id: string;
    code: string;
    name: string;
    privilege?: Array<string> | string;
}

export interface UpdateModel {
    id: string;
    code: string;
    name: string;
    privilege?: string[] | string;
    privileges?: PrivilegePayload[];
}

export interface PrivilegePayload {
    uri: string;
    method: string;
}

export interface RolePrivilege {
    role: Model[];
    privileges: Privileges[];
}

export interface RolePrivilegeItem {
    role: Model[];
    privileges: PrivilegeItem[];
}

export interface PrivilegeItem {
    code_role: string;
    action: string;
    uri: string;
    method: string;
}