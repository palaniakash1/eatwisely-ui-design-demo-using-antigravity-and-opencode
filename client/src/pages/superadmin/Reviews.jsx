import { useState } from "react";
import { Table, Badge, Button, TextInput } from "flowbite-react";
import { FaSearch, FaStar, FaTrash, FaEye } from "react-icons/fa";

const defaultReviews = [
  {
    _id: "1",
    restaurantName: "Spice Garden",
    userName: "john_doe",
    rating: 5,
    comment: "Amazing food! Best Indian cuisine in town.",
    isApproved: true,
    createdAt: "2025-01-15",
  },
  {
    _id: "2",
    restaurantName: "Golden Dragon",
    userName: "jane_smith",
    rating: 4,
    comment: "Great food but delivery was slow.",
    isApproved: true,
    createdAt: "2025-01-14",
  },
  {
    _id: "3",
    restaurantName: "Pizza Palace",
    userName: "bob_wilson",
    rating: 2,
    comment: "Food was cold and not fresh.",
    isApproved: false,
    createdAt: "2025-01-13",
  },
  {
    _id: "4",
    restaurantName: "Sushi Master",
    userName: "alice_brown",
    rating: 5,
    comment: "Best sushi I've ever had!",
    isApproved: true,
    createdAt: "2025-01-12",
  },
  {
    _id: "5",
    restaurantName: "Taco Bell",
    userName: "charlie_davis",
    rating: 3,
    comment: "Average food, good prices.",
    isApproved: true,
    createdAt: "2025-01-11",
  },
];

const getInitialReviews = () => {
  try {
    const stored = localStorage.getItem("reviews");
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load reviews:', e);
  }
  localStorage.setItem("reviews", JSON.stringify(defaultReviews));
  return defaultReviews;
};

export default function DashReviews() {
  const [reviews] = useState(getInitialReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState([]);

  const statusOptions = [
    { value: "approved", label: "Approved", selected: statusFilter.includes("approved") },
    { value: "pending", label: "Pending", selected: statusFilter.includes("pending") },
  ];

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.restaurantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter.length === 0 ||
      (statusFilter.includes("approved") && review.isApproved) ||
      (statusFilter.includes("pending") && !review.isApproved);
    
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredReviews.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusFilterChange = (value) => {
    setStatusFilter((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
    setCurrentPage(1);
  };

  const handleDeleteReview = (id) => {
    const updatedReviews = reviews.filter((r) => r._id !== id);
    setReviews(updatedReviews);
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
  };

  const handleToggleApproval = (id) => {
    const updatedReviews = reviews.map((r) =>
      r._id === id ? { ...r, isApproved: !r.isApproved } : r
    );
    setReviews(updatedReviews);
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-800">Reviews</h2>
            <Badge color="gray">{totalItems} total</Badge>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <TextInput
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <div className="flex gap-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  size="xs"
                  color={statusFilter.includes(option.value) ? "green" : "gray"}
                  onClick={() => handleStatusFilterChange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Table hoverable>
          <Table.Head className="bg-gray-50">
            <Table.HeadCell>Restaurant</Table.HeadCell>
            <Table.HeadCell>User</Table.HeadCell>
            <Table.HeadCell>Rating</Table.HeadCell>
            <Table.HeadCell>Comment</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {paginatedReviews.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={7} className="text-center py-8 text-gray-500">
                  No reviews found
                </Table.Cell>
              </Table.Row>
            ) : (
              paginatedReviews.map((review) => (
                <Table.Row key={review._id} className="bg-white">
                  <Table.Cell className="font-medium">
                    {review.restaurantName}
                  </Table.Cell>
                  <Table.Cell>{review.userName}</Table.Cell>
                  <Table.Cell>{renderStars(review.rating)}</Table.Cell>
                  <Table.Cell className="max-w-xs truncate">
                    {review.comment}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={review.isApproved ? "success" : "warning"}>
                      {review.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="xs"
                        color={review.isApproved ? "warning" : "success"}
                        onClick={() => handleToggleApproval(review._id)}
                      >
                        {review.isApproved ? "Unapprove" : "Approve"}
                      </Button>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        <FaTrash className="w-3 h-3" />
                      </Button>
                    </div>
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
              <Button
                size="xs"
                color="gray"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                size="xs"
                color="gray"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
