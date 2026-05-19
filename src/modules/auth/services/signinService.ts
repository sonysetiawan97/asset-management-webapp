import { authAxios } from "@/utils/authAxios";
import type { AuthResponse } from "../types/AuthResponse";
import type { SigninRequest } from "../types/SigninRequest";
import { setAccessToken, setRefreshToken } from "../stores/authStores";
import { setUser } from "../../users/stores/userStores";
import { AxiosError, AxiosResponse } from "axios";

export const signin = async (request: SigninRequest): Promise<AuthResponse> => {
  try {
    const response = await authAxios.post<AxiosResponse<AuthResponse>>(
      "/auth/signin",
      request,
    );
    const { data } = response.data;
    const { access_token, refresh_token, user, role } = data;

    setAccessToken(access_token);
    if (refresh_token) {
      setRefreshToken(refresh_token);
    }
    setUser(user, role);

    return data;
  } catch (error) {
    const { message } = error as AxiosError;
    throw new Error(`Signin failed: ${message}`);
  }
};
