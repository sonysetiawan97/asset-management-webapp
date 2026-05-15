import type { FC } from "react";
import { useTranslation } from "react-i18next";

const { VITE_PAGE_LIMIT } = import.meta.env;

interface PaginationProps {
  count: number;
  skip: number;
  limit?: number;
  onPageChange: (newSkip: number) => void;
}

export const Pagination: FC<PaginationProps> = ({
  count,
  skip,
  limit = VITE_PAGE_LIMIT || 10,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const maxVisiblePages = 5;
  const totalPages = Math.ceil(count / limit);
  const currentPage = totalPages === 0 ? 0 : Math.floor(skip / limit) + 1;

  const handlePageChange = (page: number) => {
    const newSkip = (page - 1) * limit;
    onPageChange(newSkip);
  };

  const pageNumbers: number[] = [];

  let startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="d-flex align-items-center gap-2 mt-4 pagination">
      <button
        type="button"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1 || totalPages === 0}
        className="btn btn-icon"
        aria-label={t("pagination.first")}
      >
        <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
          <path d="M445-253.85 218.85-480 445-706.15 487.15-664 303.77-480l183.38 184L445-253.85Zm254 0L472.85-480 699-706.15 741.15-664 557.77-480l183.38 184L699-253.85Z" />
          <title>{t("pagination.first")}</title>
        </svg>
      </button>

      <button
        type="button"
        onClick={() => onPageChange(Number(skip) - Number(limit))}
        disabled={Number(skip) <= 0}
        className="btn btn-icon"
        aria-label={t("pagination.prev")}
      >
        <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
          <path d="M560-253.85 333.85-480 560-706.15 602.15-664l-184 184 184 184L560-253.85Z" />
          <title>{t("pagination.prev")}</title>
        </svg>
      </button>

      {pageNumbers.map((page) => (
        <button
          type="button"
          key={page}
          onClick={() => handlePageChange(page)}
          className={`btn ${page === currentPage ? "active" : ""}`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(Number(skip) + Number(limit))}
        disabled={Number(skip) + Number(limit) >= count}
        className="btn btn-icon"
        aria-label={t("pagination.next")}
      >
        <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
          <path d="m517.85-480-184-184L376-706.15 602.15-480 376-253.85 333.85-296l184-184Z" />
          <title>{t("pagination.next")}</title>
        </svg>
      </button>

      <button
        type="button"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages || totalPages === 0}
        className="btn btn-icon"
        aria-label={t("pagination.last")}
      >
        <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
          <path d="M402.23-480 218.85-664 261-706.15 487.15-480 261-253.85 218.85-296l183.38-184Zm254 0L472.85-664 515-706.15 741.15-480 515-253.85 472.85-296l183.38-184Z" />
          <title>{t("pagination.last")}</title>
        </svg>
      </button>
    </div>
  );
};
