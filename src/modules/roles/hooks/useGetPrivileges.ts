import { apiAxios } from "@/utils/apiAxios";
import { ApiResponsePrivilegeMapping } from "@modules/privileges/types/Model";

const formattedPrivileges = async (): Promise<ApiResponsePrivilegeMapping> => {
  try {
    const response = await apiAxios.get<ApiResponsePrivilegeMapping>("/privileges/fetch/format");
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const useGetPrivileges = () => {
  return {
    formattedPrivileges,
  };
};