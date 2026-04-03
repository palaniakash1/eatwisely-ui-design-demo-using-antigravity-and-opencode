import { useState } from "react";
import { Table, Badge, TextInput } from "flowbite-react";
import { FaSearch, FaEye } from "react-icons/fa";

const defaultCategories = [
  {
    _id: "1",
    name: "Indian",
    slug: "indian",
    description: "Indian cuisine",
    isActive: true,
    createdAt: "2025-01-01",
  },
  {
    _id: "2",
    name: "Chinese",
    slug: "chinese",
    description: "Chinese cuisine",
    isActive: true,
    createdAt: "2025-01-01",
  },
  {
    _id: "3",
    name: "Italian",
    slug: "italian",
    description: "Italian cuisine",
    isActive: true,
    createdAt: "2025-01-01",
  },
  {
    _id: "4",
    name: "Mexican",
    slug: "mexican",
    description: "Mexican cuisine",
    isActive: false,
    createdAt: "2025-01-01",
  },
  {
    _id: "5",
    name: "Japanese",
    slug: "japanese",
    description: "Japanese cuisine",
    isActive: true,
    createdAt: "2025-01-01",
  },
];

const getInitialCategories = () => {
  try {
    const stored = localStorage.getItem("categories");
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load categories:', e);
  }
  localStorage.setItem("categories", JSON.stringify(defaultCategories));
  return defaultCategories;
};

export default function ManagerCategories() {
  const [categories] = useState(getInitialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Categories</h2>
              <p className="text-sm text-gray-500 mt-1">
                View available categories for your restaurant
              </p>
            </div>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <TextInput
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        <Table hoverable>
          <Table.Head className="bg-gray-50">
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Slug</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Created</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {paginatedCategories.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center py-8 text-gray-500">
                  No categories found
                </Table.Cell>
              </Table.Row>
            ) : (
              paginatedCategories.map((category) => (
                <Table.Row key={category._id} className="bg-white">
                  <Table.Cell className="font-medium">{category.name}</Table.Cell>
                  <Table.Cell>
                    <code className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">
                      {category.slug}
                    </code>
                  </Table.Cell>
                  <Table.Cell className="text-sm">{category.description}</Table.Cell>
                  <Table.Cell>
                    <Badge color={category.isActive ? "success" : "failure"}>
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>

        {totalItems > 0 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
