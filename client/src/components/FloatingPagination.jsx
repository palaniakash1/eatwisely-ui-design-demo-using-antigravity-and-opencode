import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function FloatingPagination({
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  label = "items",
}) {
  if (totalItems === 0) return null;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-40">
      <div className="bg-gradient-to-r from-[#6b7d18] via-[#8fa31e] to-[#a5b82e] shadow-lg shadow-[#8fa31e]/25">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          {/* Results Count */}
          <div className="flex items-center gap-2 px-4 py-3 sm:border-r sm:border-white/20">
            <span className="text-white/80 text-sm font-medium">Showing</span>
            <span className="px-2 py-1 bg-white/20 text-white font-bold text-sm rounded">
              {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>
            <span className="text-white/80 text-sm font-medium">of</span>
            <span className="px-2 py-1 bg-white/20 text-white font-bold text-sm rounded">
              {totalItems}
            </span>
            <span className="text-white/80 text-sm font-medium">{label}</span>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center gap-1 px-4 py-3">
            {/* Previous Button */}
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-white/20 rounded-sm"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {visiblePages.map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="w-9 h-9 flex items-center justify-center text-white/60 font-bold"
                    >
                      ...
                    </span>
                  );
                }

                const isActive = currentPage === page;
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-9 h-9 flex items-center justify-center font-bold transition-all rounded-sm ${
                      isActive
                        ? "bg-white text-[#6b7d18] shadow"
                        : "text-white hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-white/20 rounded-sm"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
