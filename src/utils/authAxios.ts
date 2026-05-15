import axios, { type AxiosError } from "axios";

const { VITE_API_TIMEOUT, VITE_API_AUTH_URL } = import.meta.env;

const authAxios = axios.create({
  baseURL: VITE_API_AUTH_URL,
  timeout: Number(VITE_API_TIMEOUT) || 60000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

authAxios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { status, code, message } = error;
    console.error("Response public error ::", status, code, "|", message);

    return Promise.reject(error);
  }
);

export { authAxios };
