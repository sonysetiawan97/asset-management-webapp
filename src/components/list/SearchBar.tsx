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
      <i className="bi bi-search position-absolute ms-2"></i>
      <input
        type="text"
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
