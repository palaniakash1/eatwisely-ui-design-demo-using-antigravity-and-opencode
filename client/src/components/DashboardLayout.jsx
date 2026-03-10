import { useState } from 'react'
import { FaPlus, FaSearch, FaChevronDown, FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa'

export function DashboardLayout({ children }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {children}
    </div>
  )
}

export function DashboardHeader({ title, onAddClick, searchValue, onSearchChange, filterOptions, onFilterChange, totalItems, currentPage, itemsPerPage, onPageChange }) {
  const [showFilter, setShowFilter] = useState(false)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      {/* Mobile: stacked layout */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Add button + Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {onAddClick && (
            <button
              onClick={onAddClick}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#8fa31e] text-white rounded-lg hover:bg-[#7a8c1a] transition-colors text-sm"
            >
              <FaPlus className="w-4 h-4" />
              <span className="sm:hidden lg:inline">Add</span> {title}
            </button>
          )}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Search ${title}...`}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8fa31e] focus:border-transparent w-full sm:w-64 text-sm"
            />
          </div>
        </div>

        {/* Center: Title (mobile only) */}
        <h1 className="text-lg font-bold text-gray-800 lg:hidden">
          {title}
        </h1>

        {/* Right: Filter + Pagination */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {filterOptions && filterOptions.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm w-full sm:w-auto"
              >
                <FaFilter className="w-4 h-4" />
                <span>Filter</span>
                <FaChevronDown className={`w-3 h-3 transition-transform ${showFilter ? 'rotate-180' : ''}`} />
              </button>
              {showFilter && (
                <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {filterOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={option.selected}
                        onChange={() => onFilterChange(option.value)}
                        className="rounded text-[#8fa31e]"
                      />
                      <span className="text-sm truncate">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {totalItems > 0 && (
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <FaChevronLeft className="w-3 h-3" />
                </button>
                <span className="text-sm text-gray-600 px-2 min-w-[60px] text-center">
                  {currentPage}..{totalPages}
                </span>
                <button
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <FaChevronRight className="w-3 h-3" />
                </button>
              </div>
              <select
                value={itemsPerPage}
                onChange={(e) => onPageChange(1)}
                className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          )}
        </div>
      </div>
      
      {totalItems > 0 && (
        <div className="mt-3 text-xs text-gray-500">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </div>
      )}
    </div>
  )
}

export function DashboardContent({ children }) {
  return (
    <div className="flex-1 overflow-auto p-4 lg:p-6">
      {children}
    </div>
  )
}
