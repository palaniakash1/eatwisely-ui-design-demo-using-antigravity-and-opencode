import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  Badge,
  Button,
  TextInput,
  Label,
  Modal,
  Checkbox,
} from "flowbite-react";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

import {
  DashboardHeader,
  DashboardContent,
  DashboardLayout,
} from "../components/DashboardLayout";

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
    isActive: true,
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
  {
    _id: "6",
    name: "Thai",
    slug: "thai",
    description: "Thai cuisine",
    isActive: true,
    createdAt: "2025-01-01",
  },
  {
    _id: "7",
    name: "American",
    slug: "american",
    description: "American cuisine",
    isActive: true,
    createdAt: "2025-01-01",
  },
  {
    _id: "8",
    name: "Mediterranean",
    slug: "mediterranean",
    description: "Mediterranean cuisine",
    isActive: true,
    createdAt: "2025-01-01",
  },
];

export default function DashCategories() {
  const { currentUser } = useSelector((state) => state.user);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [statusFilter, setStatusFilter] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(defaultCategories);
      localStorage.setItem("categories", JSON.stringify(defaultCategories));
    }
  }, []);

  const statusOptions = [
    {
      value: "active",
      label: "Active",
      selected: statusFilter.includes("active"),
    },
    {
      value: "inactive",
      label: "Inactive",
      selected: statusFilter.includes("inactive"),
    },
  ];

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter.length === 0 ||
      (statusFilter.includes("active") && category.isActive) ||
      (statusFilter.includes("inactive") && !category.isActive);
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredCategories.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const generateSlug = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleStatusFilterChange = (value) => {
    setStatusFilter((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );
    setCurrentPage(1);
  };

  const handleAddCategory = () => {
    const newCategory = {
      _id: Date.now().toString(),
      ...formData,
      slug: formData.slug || generateSlug(formData.name),
      createdAt: new Date().toISOString(),
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
    setShowAddModal(false);
    setFormData({ name: "", slug: "", description: "", isActive: true });
  };

  const handleEditCategory = () => {
    const updatedCategories = categories.map((c) =>
      c._id === selectedCategory._id
        ? {
            ...c,
            ...formData,
            slug: formData.slug || generateSlug(formData.name),
          }
        : c,
    );
    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
    setShowEditModal(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = (id) => {
    const updatedCategories = categories.filter((c) => c._id !== id);
    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      isActive: category.isActive,
    });
    setShowEditModal(true);
  };

  return (
    <>
      <DashboardHeader
        title="Categories"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setShowAddModal(true)}
        filterOptions={statusOptions}
        onFilterChange={handleStatusFilterChange}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
      <DashboardContent>
        <div className="overflow-x-auto">
          <div className="bg-white rounded-lg shadow min-w-full">
            <Table hoverable>
              <Table.Head className="bg-gray-50">
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Slug</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Created</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {paginatedCategories.length === 0 ? (
                  <Table.Row>
                    <Table.Cell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No categories found
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  paginatedCategories.map((category) => (
                    <Table.Row key={category._id} className="bg-white">
                      <Table.Cell className="font-medium">
                        {category.name}
                      </Table.Cell>
                      <Table.Cell>
                        <code className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">
                          {category.slug}
                        </code>
                      </Table.Cell>
                      <Table.Cell className="text-sm">
                        {category.description}
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          color={category.isActive ? "success" : "failure"}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        {new Date(category.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="xs"
                            color="blue"
                            onClick={() => openEditModal(category)}
                          >
                            <FaPencil className="w-3 h-3" />
                          </Button>
                          <Button
                            size="xs"
                            color="failure"
                            onClick={() => handleDeleteCategory(category._id)}
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
          </div>
        </div>

        <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
          <Modal.Header>Add New Category</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" value="Category Name" />
                <TextInput
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="slug" value="Slug" />
                <TextInput
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="auto-generated if empty"
                />
              </div>
              <div>
                <Label htmlFor="description" value="Description" />
                <TextInput
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              <Label htmlFor="isActive" value="Active" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleAddCategory}>Add Category</Button>
            <Button color="gray" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
          <Modal.Header>Edit Category</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName" value="Category Name" />
                <TextInput
                  id="editName"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editSlug" value="Slug" />
                <TextInput
                  id="editSlug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editDescription" value="Description" />
                <TextInput
                  id="editDescription"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <Checkbox
                id="editIsActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              <Label htmlFor="editIsActive" value="Active" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleEditCategory}>Save Changes</Button>
            <Button color="gray" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </DashboardContent>
    </>
  );
}
