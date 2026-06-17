import { AuthModel } from "@modules/auth/types/AuthModel";
import { PrivilegeItem } from '@modules/roles/types/Model';

const AUTH_LOCAL_STORAGE_KEY = "user";
const getAuth = (): AuthModel | undefined => {
  if (!localStorage) {
    return;
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);

  if (!lsValue) {
    return;
  }

  try {
    const auth: AuthModel = JSON.parse(lsValue) as AuthModel;
    if (auth) {
      // You can easily check auth_token expiration also
      return auth;
    }
  } catch (error) {
    console.error("AUTH LOCAL STORAGE PARSE ERROR", error);
  }
};

type roleprops = {
  path: string;
  auth?: AuthModel;
  method?: string;
};

const matchDynamicUri = (pattern: string, path: string): boolean => {
  // 1. Escape karakter regex spesial
  let regexPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // 2. Ganti :param jadi ([^/]+) agar cocok semua segmen path kecuali "/"
  regexPattern = regexPattern.replace(/\\:([^/]+)/g, "([^/]+)");

  const regex = new RegExp(`^${regexPattern}/?$`, "i");
  return regex.test(path.toLowerCase());
};

const hasPrivilege = (
  privileges: PrivilegeItem[],
  path: string,
  method?: string
): boolean => {
  if (!privileges || privileges.length === 0) {
    return false;
  }

  const lowerPath = path.toLowerCase();

  // Iterate through all roles
  for (const privilege of privileges) {
    const lowerUri = privilege.uri.toLowerCase();
    const lowerAction = privilege.action.toLowerCase();
    const lowerMethod = (privilege.method || "*").toLowerCase();

    // 1. Wildcard - all access (supports both "*" and "all" as wildcard values)
    if (lowerUri === "*" && (lowerAction === "*" || lowerAction === "all" || lowerMethod === "*" || lowerMethod === "all")) {
      return true;
    }

    // 2. Check method if provided
    if (method && lowerMethod !== "*" && lowerMethod !== "all" && lowerMethod !== method.toLowerCase()) {
      continue;
    }

    // 3. Exact match
    if (lowerUri === lowerPath) {
      return true;
    }

    // 4. Dynamic match with :param
    if (lowerUri.includes(":") && matchDynamicUri(privilege.uri, lowerPath)) {
      return true;
    }

    // 5. Prefix match: check if privilege URI starts with requested path
    // at a path segment boundary (e.g., /opname matches /opname/sessions)
    if (lowerUri.startsWith(lowerPath + "/")) {
      return true;
    }
  }

  return false;
};

const PrivilegesValidation = ({ path, auth, method }: roleprops): boolean => {
  if (!auth) return false;

  const { role: rolePrivileges } = auth;
  if (!rolePrivileges?.privileges) return false;

  const { privileges } = rolePrivileges;

  if (!privileges || privileges.length == 0) return false

  return hasPrivilege(privileges, path, method);
};

export {
  getAuth,
  AUTH_LOCAL_STORAGE_KEY,
  PrivilegesValidation,
};