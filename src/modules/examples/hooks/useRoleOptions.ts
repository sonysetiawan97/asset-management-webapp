import type { LoadOptions } from "react-select-async-paginate";
import type { GroupBase } from "react-select";
import type { SelectOption } from "@/types/SelectOption";
import { findAll } from "@services/findAll";
import { Model, moduleName } from "@modules/roles/types/RoleTypes";
import { findOneById } from "@services/findOneById";
import { useEffect, useRef, useState } from "react";

export const useRoleOptions = () => {
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
          const response = await findAll<Model>("/roles", {
            "name!like": inputValue,
            status: "1",
            "!sort[id]": -1,
            "!limit": limit,
            "!skip": additional.skip,
          });

          const result = response?.data?.result ?? [];

          const options: SelectOption[] = result.map((item) => ({
            value: item.id as number,
            label: item.name,
          }));

          resolve({
            options,
            hasMore: result.length === limit,
            additional: {
              skip: additional.skip + limit,
            },
          });
        })();
      }, 400);
    });
  };

  return loadOptions;
};

export const useRoleById = (id: string | undefined) => {
  const [defaultValue, setDefaultValue] = useState<SelectOption | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await findOneById<Model>(moduleName, id);
        if (
          response &&
          response.id !== undefined &&
          response.name !== undefined
        ) {
          setDefaultValue({
            value: response.id,
            label: response.name,
          });
        } else {
          setDefaultValue(undefined);
        }
      } catch (error) {
        console.error("Failed to fetch role:", error);
        setDefaultValue(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { defaultValue, loading };
};
