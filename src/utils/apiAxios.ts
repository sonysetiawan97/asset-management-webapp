import axios, { type AxiosError } from "axios";
import { axiosSetup } from "./axiosSetup";
import { authAxios } from "./authAxios";
import { getRefreshToken } from "../modules/auth/stores/authStores";
import { logout } from "../modules/auth/services/logoutService";

const { VITE_API_BASE_URL, VITE_API_TIMEOUT } = import.meta.env;

const apiAxios = axios.create({
  baseURL: VITE_API_BASE_URL,
  timeout: Number(VITE_API_TIMEOUT) || 60000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiAxios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { status, code, message } = error;
    console.error("Response api error ::", status, code, "|", message);
    return Promise.reject(error);
  },
);

axiosSetup(apiAxios, { getRefreshToken, authAxios, onLogout: logout });

export { apiAxios };
