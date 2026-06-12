import { useRef } from "react";
import type { LoadOptions } from "react-select-async-paginate";
import type { GroupBase } from "react-select";
import type { SelectOption } from "@/types/SelectOption";
import { findAll } from "@services/findAll";

interface MaintenanceAsset {
  id: string;
  name: string;
  asset_code: string;
}

const LIMIT = 10;

export const useAssetOptions = () => {
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
          const response = await findAll<MaintenanceAsset>("assets", {
            "asset_status!in": "available,in_use,reserved",
            "name!like": inputValue,
            "!sort[id]": -1,
            "!limit": LIMIT,
            "!skip": additional.skip,
          });

          const result = response?.data?.result ?? [];

          const options: SelectOption[] = result.map((item) => ({
            value: item.id,
            label: `${item.name} (${item.asset_code})`,
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
