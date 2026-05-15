export interface Auth {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken?: string | null;
}
