import { atom } from "nanostores";
import type { Auth } from "../types/AuthTypes";

const init = {
  isAuthenticated: !!localStorage.getItem("accessToken"),
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken") ?? null,
};

const authStores = atom<Auth>(init);

const setAccessToken = (accessToken: string): void => {
  localStorage.setItem("accessToken", accessToken);
  authStores.set({ accessToken, refreshToken: localStorage.getItem("refreshToken"), isAuthenticated: true });
};

const setRefreshToken = (refreshToken: string): void => {
  localStorage.setItem("refreshToken", refreshToken);
  authStores.set({ accessToken: localStorage.getItem("accessToken"), refreshToken, isAuthenticated: true });
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

const clearAccessToken = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  authStores.set({ accessToken: null, refreshToken: null, isAuthenticated: false });
};

const clearRefreshToken = (): void => {
  localStorage.removeItem("refreshToken");
  const current = authStores.get();
  authStores.set({ ...current, refreshToken: null });
};

export { authStores, setAccessToken, clearAccessToken, setRefreshToken, getRefreshToken, clearRefreshToken };
