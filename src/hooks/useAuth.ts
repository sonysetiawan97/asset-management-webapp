import { useStore } from "@nanostores/react";
import { authStores } from "@modules/auth/stores/authStores";
import { userStores } from "@modules/users/stores/userStores";
import { logout as logoutUser } from "@modules/auth/services/logoutService";

const logout = () => {
  logoutUser();
  window.location.href = "/auth/signin";
};

const useAuth = () => {
  const auth = useStore(authStores);
  const user = useStore(userStores);

  return {
    ...auth,
    user,
    logout,
  };
};

export { useAuth, logout };
