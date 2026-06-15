import { useRef } from "react";
import type { LoadOptions } from "react-select-async-paginate";
import type { GroupBase } from "react-select";
import type { SelectOption } from "@/types/SelectOption";
import { findAll } from "@services/findAll";

const LIMIT = 10;

export const useLocationOptions = () => {
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
          const response = await findAll<{ id: string; name: string }>(
            "locations",
            {
              "name!like": inputValue,
              "!sort[id]": -1,
              "!limit": LIMIT,
              "!skip": additional.skip,
            }
          );

          const result = response?.data?.result ?? [];

          const options: SelectOption[] = [
            { value: "", label: "-- No Location --" },
            ...result.map((item) => ({
              value: item.id,
              label: item.name,
            })),
          ];

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
