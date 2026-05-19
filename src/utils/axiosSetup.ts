/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const { VITE_API_BASE_URL, VITE_API_AUTH_URL, VITE_API_TIMEOUT } = import.meta.env;

// Shared refresh promise — prevents concurrent refresh calls from racing.
let refreshPromise: Promise<boolean> | null = null;

const refreshAccessToken = async (): Promise<boolean> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const { data } = await axios.post(
        `${VITE_API_AUTH_URL}/auth/refresh`,
        {},
        { withCredentials: true, headers: { Authorization: `Bearer ${storedRefreshToken}` } },
      );
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      return true;
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return false;
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

const MAX_RETRIES = 3;

const axiosSetup = (instance: {
  interceptors: {
    request: { use: Function };
    response: { use: Function };
  };
}) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): typeof config => {
      config.baseURL = VITE_API_BASE_URL;
      config.timeout = VITE_API_TIMEOUT || 10;
      config.headers["Content-Type"] = "application/json";
      config.withCredentials = true;

      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: unknown) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response: unknown) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
        _retryCount?: number;
      };

      if (!originalRequest) {
        return Promise.reject(error);
      }

      const status = error.response?.status;

      // 401 — refresh token, then retry original request once
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const success = await refreshAccessToken();
        if (success) {
          originalRequest.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
          return axios(originalRequest);
        }

        const { logout } = await import("@modules/auth/services/logoutService");
        logout();
        window.location.href = "/auth/signin";
        return Promise.reject(error);
      }

      // 5xx — retry up to MAX_RETRIES times
      if (status && status >= 500 && !originalRequest._retryCount) {
        originalRequest._retryCount = 1;
        return retryRequest(originalRequest, 1);
      }

      return Promise.reject(error);
    }
  );
};

// Separated to keep the interceptor clean and allow recursion
async function retryRequest(
  config: InternalAxiosRequestConfig & { _retryCount?: number },
  attempt: number
): Promise<unknown> {
  if (attempt > MAX_RETRIES) {
    return Promise.reject(new Error(`Request failed after ${MAX_RETRIES} retries`));
  }

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    const err = error as AxiosError;
    const status = err.response?.status;
    const retryCount = (config._retryCount || 0) + 1;

    if (status && status >= 500 && retryCount <= MAX_RETRIES) {
      config._retryCount = retryCount;
      return retryRequest(config, retryCount);
    }

    return Promise.reject(error);
  }
}

export { axiosSetup };
