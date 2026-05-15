import { atom } from "nanostores";
import type { User } from "../types/UserTypes";
import { RolePrivilege } from "@modules/roles/types/Model";

const init: User | null = (() => {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }
  return null;
})();

const userStores = atom<User | null>(init);

const setUser = (user: User, role?: RolePrivilege) => {
  const prevUser = localStorage.getItem("user");
  const prevRole = prevUser ? JSON.parse(prevUser).role : undefined;

  const userData = {
    ...user,
    role: role ?? prevRole,
  };

  localStorage.setItem("user", JSON.stringify(userData));
  userStores.set(userData);
};

const clearUser = () => {
  userStores.set(null);
  localStorage.removeItem("user");
};

export { userStores, setUser, clearUser };
