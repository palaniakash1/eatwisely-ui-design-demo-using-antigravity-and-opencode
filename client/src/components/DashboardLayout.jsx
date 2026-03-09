import { useState } from 'react'
import { FaPlus, FaSearch, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {onAddClick && (
            <button
              onClick={onAddClick}
              className="flex items-center gap-2 px-4 py-2 bg-[#8fa31e] text-white rounded-lg hover:bg-[#7a8c1a] transition-colors"
            >
              <FaPlus className="w-5 h-5" />
              Add {title}
            </button>
          )}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search ${title}...`}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8fa31e] focus:border-transparent w-64"
            />
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-800 absolute left-1/2 transform -translate-x-1/2">
          {title}
        </h1>

        <div className="flex items-center gap-4">
          {filterOptions && filterOptions.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <span>Filter</span>
                <FaChevronDown className="w-4 h-4" />
              </button>
              {showFilter && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {totalItems > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">
                {currentPage}..{totalPages}
              </span>
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
              <select
                value={itemsPerPage}
                onChange={(e) => onPageChange(1)}
                className="ml-2 px-2 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value={10}>10/page</option>
                <option value={25}>25/page</option>
                <option value={50}>50/page</option>
                <option value={100}>100/page</option>
              </select>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
      </div>
    </div>
  )
}

export function DashboardContent({ children }) {
  return (
    <div className="flex-1 overflow-auto p-6">
      {children}
    </div>
  )
}
