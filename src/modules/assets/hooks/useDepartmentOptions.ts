import { useRef } from "react";
import type { LoadOptions } from "react-select-async-paginate";
import type { GroupBase } from "react-select";
import type { SelectOption } from "@/types/SelectOption";
import { findAll } from "@services/findAll";
import { getAuth } from "@components/auth/AuthHelpers";

const LIMIT = 10;

export const useDepartmentOptions = (scoped = false) => {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadOptions: LoadOptions<
    SelectOption,
    GroupBase<SelectOption>,
    { skip: number }
  > = (inputValue, _prevOptions, additional = { skip: 0 }) => {
    return new Promise((resolve) => {
      const doFetch = async () => {
        const auth = getAuth();
        const roleCode = auth?.role?.role?.[0]?.code;
        const isScoped = scoped && (roleCode === "staff" || roleCode === "manager");
        const userDeptId = auth?.department_id;

        let response;
        if (isScoped && userDeptId) {
          response = await findAll<{ id: string; name: string }>(
            "departments",
            { id: String(userDeptId) }
          );
        } else {
          response = await findAll<{ id: string; name: string }>(
            "departments",
            {
              "name!like": inputValue,
              "!sort[id]": -1,
              "!limit": LIMIT,
              "!skip": additional.skip,
            }
          );
        }

        const result = response?.data?.result ?? [];

        const options: SelectOption[] = result.map((item) => ({
          value: item.id,
          label: item.name,
        }));

        if (!isScoped) {
          options.unshift({ value: "", label: "-- Select Department --" });
        }

        resolve({
          options,
          hasMore: !isScoped && result.length === LIMIT,
          additional: {
            skip: isScoped ? 0 : additional.skip + LIMIT,
          },
        });
      };

      if (inputValue) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(doFetch, 400);
      } else {
        doFetch();
      }
    });
  };

  return loadOptions;
};
