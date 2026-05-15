import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoadOptions } from "react-select-async-paginate";
import type { GroupBase } from "react-select";
import type { SelectOption } from "@/types/SelectOption";
import axios from "axios";

interface Additional {
  skip: number;
}

const pokeAxios = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

export const usePokemonOptions = (): LoadOptions<
  SelectOption,
  GroupBase<SelectOption>,
  Additional
> => {
  const queryClient = useQueryClient();

  return useCallback(
    async (_inputValue, _prevOptions, additional = { skip: 0 }) => {
      const limit = 10;
      const skip = additional.skip;

      const result = await queryClient.fetchInfiniteQuery({
        queryKey: ["pokemons", skip, limit, _inputValue],
        queryFn: async ({ pageParam = skip }) => {
          const { data } = await pokeAxios.get("/pokemon", {
            params: {
              offset: pageParam,
              limit,
              name: _inputValue,
            },
          });

          return data.results.map((item: { name: string; url: string }) => ({
            value: item.name,
            label: item.name,
          }));
        },
        initialPageParam: skip,
        getNextPageParam: ({ length }: []) => {
          return length < limit ? undefined : skip + limit;
        },
        staleTime: 1000 * 60 * 5,
      });

      const options = result.pages[result.pages.length - 1];

      return {
        options,
        hasMore: options.length === limit,
        additional: {
          skip: skip + limit,
        },
      };
    },
    [queryClient]
  );
};

export const usePokemonByName = (name: string) => {
  return useQuery<SelectOption>({
    queryKey: ["pokemon", name],
    initialData: undefined,
    queryFn: async () => {
      const { data } = await pokeAxios.get(`/pokemon/${name}`);
      return { label: data.name, value: data.name };
    },
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const getPokemonByName = async (
  name: string
): Promise<SelectOption | undefined> => {
  try {
    const res = await pokeAxios.get(`/pokemon/${name}`);
    return { label: res.data.name, value: res.data.name };
  } catch {
    return undefined;
  }
};
