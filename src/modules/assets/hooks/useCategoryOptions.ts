import { useRef } from "react";
import type { LoadOptions } from "react-select-async-paginate";
import type { GroupBase } from "react-select";
import type { SelectOption } from "@/types/SelectOption";
import { findAll } from "@services/findAll";
import { findOneById } from "@services/findOneById";

export interface CategoryOptionDetail {
  id: string;
  name: string;
  useful_life_years: number;
  salvage_value_pct: number;
}

export const getCategoryById = async (
  id: string
): Promise<{ option: SelectOption; detail: CategoryOptionDetail } | null> => {
  try {
    const response = await findOneById<CategoryOptionDetail>("options/categories", id);
    if (response) {
      return {
        option: { value: response.id, label: response.name },
        detail: response,
      };
    }
    return null;
  } catch {
    return null;
  }
};

const LIMIT = 10;

export const useCategoryOptions = () => {
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
            "options/categories",
            {
              "name!like": inputValue,
              "!sort[id]": -1,
              "!limit": LIMIT,
              "!skip": additional.skip,
            }
          );

          const result = response?.data?.result ?? [];

          const options: SelectOption[] = result.map((item) => ({
            value: item.id,
            label: item.name,
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
