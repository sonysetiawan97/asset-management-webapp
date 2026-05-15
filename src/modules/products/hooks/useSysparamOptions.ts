import { Model, moduleName } from "@modules/sysparam/types/Model";
import { findAll } from "@services/findAll";
import { SelectOption } from "@/types/SelectOption";
import { useEffect, useRef, useState } from "react";
import { LoadOptions } from "react-select-async-paginate";
import { GroupBase } from "react-select";

interface SysparamOptionsProps {
  groupName: string;
}

export const useSysparamOptions = ({ groupName }: SysparamOptionsProps) => {
  const limit = 10;
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
          const response = await findAll<Model>(`/${moduleName}`, {
            "!search": inputValue,
            status: "1",
            "!sort[id]": -1,
            "!limit": limit,
            "!skip": additional.skip,
            group: groupName,
          });

          const result = response?.data?.result ?? [];

          const options: SelectOption[] = result.map((item) => ({
            value: item.key as string,
            label: item.value,
          }));

          resolve({
            options,
            hasMore: result.length === limit,
            additional: {
              skip: additional.skip + limit,
            },
          });
        })();
      }, 500);
    });
  };

  return loadOptions;
};

export const useDefaultOptionSysparamByGroup = (
  group: string | undefined,
  initialData: string[] | undefined
) => {
  const [defaultValues, setDefaultValues] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (!group) {
      setDefaultValues([]);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await findAll<Model>(`/${moduleName}`, {
          group,
          status: "1",
        });

        const items = response?.data?.result ?? [];

        const matchedOptions: SelectOption[] = initialData
          ?.map((key) => {
            const found = items.find((item) => item.key === key);
            return found
              ? {
                  value: found.key as string,
                  label: found.value,
                }
              : undefined;
          })
          .filter(Boolean) as SelectOption[];

        setDefaultValues(matchedOptions);
      } catch (error) {
        console.error("Failed to fetch sysparam:", error);
        setDefaultValues([]);
      }
    };

    fetchData();
  }, [group, initialData]);

  return {
    defaultValues,
  };
};
