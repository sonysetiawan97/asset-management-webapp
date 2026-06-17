import { useRef } from "react";
import type { LoadOptions } from "react-select-async-paginate";
import type { GroupBase } from "react-select";
import type { SelectOption } from "@/types/SelectOption";
import { findAll } from "@services/findAll";

const LIMIT = 10;

export const useUserOptions = () => {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadOptions: LoadOptions<
    SelectOption,
    GroupBase<SelectOption>,
    { skip: number }
  > = (inputValue, _prevOptions, additional = { skip: 0 }) => {
    return new Promise((resolve) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        (async () => {
          const response = await findAll<{
            id: number;
            first_name: string;
            last_name: string;
          }>("options/users", {
            "first_name!like": inputValue,
            "!sort[id]": -1,
            "!limit": LIMIT,
            "!skip": additional.skip,
          });

          const result = response?.data?.result ?? [];

          const options: SelectOption[] = result.map((item) => ({
            value: String(item.id),
            label: `${item.first_name} ${item.last_name}`.trim(),
          }));

          resolve({
            options,
            hasMore: result.length === LIMIT,
            additional: {
              skip: additional.skip + LIMIT,
            },
          });
        })();
      }, 400);
    });
  };

  return loadOptions;
};
