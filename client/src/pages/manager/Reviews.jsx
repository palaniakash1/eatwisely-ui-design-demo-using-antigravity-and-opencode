import { useState, useEffect } from "react";
import { Table, Badge, Button, TextInput } from "flowbite-react";
import { FaSearch, FaStar, FaTrash } from "react-icons/fa";

const defaultManagerReviews = [
  {
    _id: "1",
    userName: "john_doe",
    rating: 5,
    comment: "Amazing food! Best in town.",
    isApproved: true,
    createdAt: "2025-01-15",
  },
  {
    _id: "2",
    userName: "jane_smith",
    rating: 4,
    comment: "Great food but delivery was slow.",
    isApproved: true,
    createdAt: "2025-01-14",
  },
  {
    _id: "3",
    userName: "bob_wilson",
    rating: 2,
    comment: "Food was cold.",
    isApproved: false,
    createdAt: "2025-01-13",
  },
];

export default function ManagerReviews() {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const storedReviews = localStorage.getItem("manager_reviews");
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      setReviews(defaultManagerReviews);
      localStorage.setItem("manager_reviews", JSON.stringify(defaultManagerReviews));
    }
  }, []);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalItems = filteredReviews.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  const handleToggleApproval = (id) => {
    const updatedReviews = reviews.map((r) =>
      r._id === id ? { ...r, isApproved: !r.isApproved } : r
    );
    setReviews(updatedReviews);
    localStorage.setItem("manager_reviews", JSON.stringify(updatedReviews));
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

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-2xl font-bold text-gray-800">{reviews.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Average Rating</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-800">{averageRating}</p>
            <FaStar className="w-5 h-5 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Pending Reviews</p>
          <p className="text-2xl font-bold text-gray-800">
            {reviews.filter(r => !r.isApproved).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-800">Menu Reviews</h2>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <TextInput
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>

        <Table hoverable>
          <Table.Head className="bg-gray-50">
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
                <Table.Cell colSpan={6} className="text-center py-8 text-gray-500">
                  No reviews found
                </Table.Cell>
              </Table.Row>
            ) : (
              paginatedReviews.map((review) => (
                <Table.Row key={review._id} className="bg-white">
                  <Table.Cell className="font-medium">{review.userName}</Table.Cell>
                  <Table.Cell>{renderStars(review.rating)}</Table.Cell>
                  <Table.Cell className="max-w-xs truncate">{review.comment}</Table.Cell>
                  <Table.Cell>
                    <Badge color={review.isApproved ? "success" : "warning"}>
                      {review.isApproved ? "Visible" : "Hidden"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      size="xs"
                      color={review.isApproved ? "warning" : "success"}
                      onClick={() => handleToggleApproval(review._id)}
                    >
                      {review.isApproved ? "Hide" : "Show"}
                    </Button>
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
