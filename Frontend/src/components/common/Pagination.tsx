interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

function Pagination({ currentPage, totalPages, onPageChange, loading = false }: PaginationProps) {
  if (loading || totalPages <= 1) return null;

  const pageButtons = Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
    let pageNum: number;
    if (totalPages <= 5) pageNum = i;
    else if (currentPage < 3) pageNum = i;
    else if (currentPage >= totalPages - 3) pageNum = totalPages - 5 + i;
    else pageNum = currentPage - 2 + i;
    return pageNum;
  });

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <button type="button" onClick={() => onPageChange(0)} disabled={currentPage === 0}
        className="rounded-full bg-[#4E6A4E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3d4938] disabled:cursor-not-allowed disabled:opacity-40">
        Trang đầu
      </button>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button type="button" onClick={() => onPageChange(Math.max(0, currentPage - 1))} disabled={currentPage === 0}
          className="rounded-full border border-[#4E6A4E] px-4 py-2 text-sm font-medium text-[#4E6A4E] transition hover:bg-[#4E6A4E]/10 disabled:cursor-not-allowed disabled:opacity-40">
          ←
        </button>
        {pageButtons.map((pageNum) => (
          <button key={pageNum} type="button" onClick={() => onPageChange(pageNum)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${
              pageNum === currentPage
                ? "border-[#4E6A4E] bg-[#4E6A4E] text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}>
            {pageNum + 1}
          </button>
        ))}
        <button type="button" onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage >= totalPages - 1}
          className="rounded-full border border-[#4E6A4E] px-4 py-2 text-sm font-medium text-[#4E6A4E] transition hover:bg-[#4E6A4E]/10 disabled:cursor-not-allowed disabled:opacity-40">
          →
        </button>
      </div>
      <button type="button" onClick={() => onPageChange(totalPages - 1)} disabled={currentPage >= totalPages - 1}
        className="rounded-full bg-[#4E6A4E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3d4938] disabled:cursor-not-allowed disabled:opacity-40">
        Trang cuối
      </button>
    </div>
  );
}

export default Pagination;
