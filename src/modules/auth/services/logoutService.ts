import { clearUser } from '../../users/stores/userStores';
import { clearAccessToken, clearRefreshToken } from '../stores/authStores';

export const logout = () => {
  clearAccessToken();
  clearRefreshToken();
  clearUser();
};
