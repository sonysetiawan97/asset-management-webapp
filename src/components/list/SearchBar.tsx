import { type FC, useState, useEffect } from "react";
import { useSearch } from "@hooks/list/useSearch";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  debounceMs?: number;
}

export const SearchBar: FC<SearchBarProps> = ({ debounceMs = 500 }) => {
  const { query, setQuery } = useSearch();
  const [localQuery, setLocalQuery] = useState(query);
  const { t } = useTranslation();

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(localQuery);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [localQuery, debounceMs, setQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  const clearSearch = () => {
    setLocalQuery("");
  };

  return (
    <div className="position-relative d-flex align-items-center">
      <svg
        className="position-absolute ms-2"
        xmlns="http://www.w3.org/2000/svg"
        height="20px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#1f1f1f"
      >
        <title>Search</title>
        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
      </svg>
      <input
        type="search"
        className="form-control border-dark ps-5"
        placeholder={t("list.search")}
        value={localQuery}
        onChange={handleChange}
      />
      {localQuery && (
        <button
          type="button"
          className="btn btn-link position-absolute end-0 me-2"
          onClick={clearSearch}
        >
          ✖
        </button>
      )}
    </div>
  );
};
