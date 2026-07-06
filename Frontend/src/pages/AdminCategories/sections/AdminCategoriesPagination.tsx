interface AdminCategoriesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

const AdminCategoriesPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  loading,
}: AdminCategoriesPaginationProps) => {
  if (loading || totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-4 px-4">
      <button
        onClick={() => onPageChange(0)}
        disabled={currentPage === 0}
        className="px-6 py-2 bg-brand-primary text-white font-medium rounded-full hover:bg-[#3d4938] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        Trang đầu
      </button>

      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className="px-6 py-2 bg-brand-primary text-white font-medium rounded-full hover:bg-[#3d4938] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        ← Trước
      </button>

      <div className="flex gap-2">
        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
          let pageNum: number;
          if (totalPages <= 5) {
            pageNum = i;
          } else if (currentPage < 3) {
            pageNum = i;
          } else if (currentPage >= totalPages - 3) {
            pageNum = totalPages - 5 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm font-medium transition-colors
                ${
                  pageNum === currentPage
                    ? "border-brand-primary bg-brand-primary font-bold text-white"
                    : "border-brand-heading text-brand-heading hover:bg-gray-100"
                }
              `}
            >
              {pageNum + 1}
            </button>
          );
        })}
      </div>

      <button
        onClick={() =>
          onPageChange(Math.min(totalPages - 1, currentPage + 1))
        }
        disabled={currentPage >= totalPages - 1}
        className="px-6 py-2 bg-brand-primary text-white font-medium rounded-full hover:bg-[#3d4938] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        Sau →
      </button>

      <button
        onClick={() => onPageChange(totalPages - 1)}
        disabled={currentPage >= totalPages - 1}
        className="px-6 py-2 bg-brand-primary text-white font-medium rounded-full hover:bg-[#3d4938] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        Trang cuối
      </button>
    </div>
  );
};

export default AdminCategoriesPagination;
