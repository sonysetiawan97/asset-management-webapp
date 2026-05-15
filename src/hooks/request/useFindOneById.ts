import { useQuery } from "@tanstack/react-query";
import { findOneById } from "@services/findOneById";
import i18next from "i18next";

export const useFindOneById = <T>(url: string, id?: string) => {
  return useQuery({
    queryKey: [url, id],
    queryFn: () =>
      id
        ? findOneById<T>(url, id)
        : Promise.reject(i18next.t("request.error.no_id")),
    enabled: !!id,
  });
};
