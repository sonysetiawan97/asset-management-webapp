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
  limit = Number(VITE_PAGE_LIMIT) || 10,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const totalPages = Math.ceil(count / limit);
  const currentPage = totalPages === 0 ? 0 : Math.floor(skip / limit) + 1;

  const handlePageChange = (page: number) => {
    const newSkip = (page - 1) * limit;
    onPageChange(newSkip);
  };

  const goPrev = () => onPageChange(Number(skip) - Number(limit));
  const goNext = () => onPageChange(Number(skip) + Number(limit));

  return (
    <div className="d-flex justify-content-center align-items-center gap-2 mt-4 pagination">
      {/* First — only shown when totalPages > 2 and not on page 1 */}
      {totalPages > 2 && currentPage > 1 && (
        <button
          type="button"
          onClick={() => handlePageChange(1)}
          className="btn btn-outline-secondary btn-sm"
          title={t("pagination.first")}
        >
          <span>First</span>
        </button>
      )}

      {/* Prev */}
      <button
        type="button"
        onClick={goPrev}
        disabled={currentPage === 1 || totalPages === 0}
        className="btn btn-outline-secondary btn-sm"
        title={t("pagination.prev")}
      >
        <span>Prev</span>
      </button>

      {/* Next */}
      <button
        type="button"
        onClick={goNext}
        disabled={currentPage === totalPages || totalPages === 0}
        className="btn btn-outline-secondary btn-sm"
        title={t("pagination.next")}
      >
        <span>Next</span>
      </button>

      {/* Last — only shown when totalPages > 2 and not on last page */}
      {totalPages > 2 && currentPage < totalPages && (
        <button
          type="button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="btn btn-outline-secondary btn-sm"
          title={t("pagination.last")}
        >
          <span>Last</span>
        </button>
      )}
    </div>
  );
};