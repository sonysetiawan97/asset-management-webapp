import { SelectOption } from "@/types/SelectOption";
import { Model, moduleName } from "@modules/roles/types/Model";
import { findAll } from "@services/findAll";
import { findOneById } from "@services/findOneById";
import { useEffect, useRef, useState } from "react";
import { GroupBase } from "react-select";
import { LoadOptions } from "react-select-async-paginate";

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
          const response = await findAll<Model>(`/${moduleName}`, {
            "!search": inputValue,
            status: "1",
            "!sort[id]": -1,
            "!limit": limit,
            "!skip": additional.skip,
          });

          const result = response?.data?.result ?? [];

          const options: SelectOption[] = result.map((item) => ({
            value: item.code as string,
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
      }, 500);
    });
  };

  return loadOptions;
};

export const useOptionRoleByCode = (value: string[] | undefined) => {
  const [defaultValue, setDefaultValue] = useState<SelectOption | undefined>(
    undefined
  );

  useEffect(() => {
    if (!value) {
      setDefaultValue(undefined);
      return;
    }

    const selectedCode = value[0];

    const fetchData = async () => {
      try {
        const response = await findAll<Model>(`/${moduleName}`, {
          status: "1",
        });

        const items: Model[] = response?.data?.result ?? [];

        const matchedItem = items.find((item) => item.code === selectedCode);

        if (!matchedItem) {
          setDefaultValue(undefined);
          return;
        }

        setDefaultValue({
          value: matchedItem.code as string,
          label: matchedItem.name,
        });
      } catch (error) {
        console.error("Failed to fetch role:", error);
        setDefaultValue(undefined);
      }
    };

    fetchData();
  }, [value]);

  return {
    defaultValue,
  };
};

export const useOptionsRoleById = (id: string | undefined) => {
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
