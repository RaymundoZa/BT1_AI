// src/components/Pagination.tsx
import React from 'react';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChangePage: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onChangePage }) => {
  const pages = [...Array(totalPages)].map((_, i) => i);

  return (
    <div className="flex items-center justify-center space-x-2 py-4 mx-auto">
      <button
        onClick={() => onChangePage(Math.max(0, page - 1))}
        disabled={page === 0}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        ‹‹
      </button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChangePage(p)}
          className={
            p === page
              ? 'px-3 py-1 border rounded bg-blue-600 text-white'
              : 'px-3 py-1 border rounded'
          }
        >
          {p + 1}
        </button>
      ))}
      <button
        onClick={() => onChangePage(Math.min(totalPages - 1, page + 1))}
        disabled={page === totalPages - 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        ››
      </button>
    </div>
  );
};

export default Pagination;
