import axios, { type AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

const { VITE_API_BASE_URL, VITE_API_TIMEOUT } = import.meta.env;

// --- Types ---

type RefreshTokenFn = () => string | null;

interface RefreshData {
  access_token: string;
  refresh_token: string;
}

interface RefreshResponse {
  status: boolean;
  data: RefreshData;
  message: string;
  code: number;
}

type AuthAxiosInstance = {
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: Record<string, unknown>,
  ) => Promise<{ data: T }>;
};

interface AxiosSetupDeps {
  getRefreshToken: RefreshTokenFn;
  authAxios: AuthAxiosInstance;
  onLogout?: () => void;
}

// --- Factory ---

const createRefreshAccessToken = (deps: AxiosSetupDeps) => {
  const { getRefreshToken, authAxios } = deps;
  let refreshPromise: Promise<boolean> | null = null;

  return async (): Promise<boolean> => {
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      try {
        const storedRefreshToken = getRefreshToken();
        const response = await authAxios.post<RefreshResponse>(
          "/auth/refresh",
          {},
          { headers: { Authorization: `Bearer ${storedRefreshToken}` } },
        );
        const { access_token, refresh_token } = response.data.data;
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
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
};

// --- Main setup ---

const MAX_RETRIES = 3;

const axiosSetup = (
  instance: AxiosInstance,
  deps: AxiosSetupDeps,
) => {
  const refreshAccessToken = createRefreshAccessToken(deps);
  const { onLogout } = deps;

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
    (error: unknown) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
        _retryCount?: number;
      };

      if (!originalRequest) {
        return Promise.reject(error);
      }

      const status = error.response?.status;

      // 401 — attempt token refresh, once per request
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const success = await refreshAccessToken();
        if (success) {
          originalRequest.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
          return axios(originalRequest);
        }

        onLogout?.();
        window.location.href = "/auth/signin";
        return Promise.reject(error);
      }

      // 403 — inactive user → force logout
      if (status === 403) {
        const body = error.response?.data as Record<string, unknown> | undefined;
        const message = body?.message;
        if (typeof message === "string" && message.toLowerCase().includes("no longer active")) {
          onLogout?.();
          window.location.href = "/auth/signin";
          return Promise.reject(error);
        }
      }

      // 5xx — retry up to MAX_RETRIES times
      if (status && status >= 500 && !originalRequest._retryCount) {
        originalRequest._retryCount = 1;
        return retryRequest(originalRequest, 1);
      }

      return Promise.reject(error);
    },
  );
};

// Separated to keep the interceptor clean and allow recursion
async function retryRequest(
  config: InternalAxiosRequestConfig & { _retryCount?: number },
  attempt: number,
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
export type { AxiosSetupDeps };
