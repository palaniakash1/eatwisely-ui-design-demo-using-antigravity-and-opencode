import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  Badge,
  Button,
  TextInput,
  Label,
  Modal,
  Select,
  Textarea,
} from "flowbite-react";
import { FaTrash, FaSearch, FaEye } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import {
  DashboardHeader,
  DashboardContent,
  DashboardLayout,
} from "../components/DashboardLayout";

import { Link } from "react-router-dom";
import restaurantsData from "../data/restaurants.json";

export default function DashRestaurants() {
  const { currentUser } = useSelector((state) => state.user);
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [statusFilter, setStatusFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      areaLocality: "",
      city: "London",
      countyRegion: "Greater London",
      postcode: "",
      country: "United Kingdom",
      location: { type: "Point", coordinates: [0, 51.5074] },
    },
    contactNumber: "",
    email: "",
    website: "",
    categories: [],
    status: "draft",
    isActive: true,
    isFeatured: false,
    isTrending: false,
  });

  useEffect(() => {
    const storedRestaurants = localStorage.getItem("restaurants");
    if (storedRestaurants) {
      setRestaurants(JSON.parse(storedRestaurants));
    } else {
      setRestaurants(restaurantsData);
      localStorage.setItem("restaurants", JSON.stringify(restaurantsData));
    }
  }, []);

  const allCategories = [
    ...new Set(restaurants.flatMap((r) => r.categories || [])),
  ];

  const statusOptions = [
    {
      value: "published",
      label: "Published",
      selected: statusFilter.includes("published"),
    },
    {
      value: "draft",
      label: "Draft",
      selected: statusFilter.includes("draft"),
    },
    {
      value: "blocked",
      label: "Blocked",
      selected: statusFilter.includes("blocked"),
    },
  ];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.address?.city
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(restaurant.status);
    const matchesCategory =
      categoryFilter.length === 0 ||
      (restaurant.categories || []).some((c) => categoryFilter.includes(c));

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalItems = filteredRestaurants.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRestaurants = filteredRestaurants.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (value) => {
    setCategoryFilter((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    );
    setCurrentPage(1);
  };

  const handleAddRestaurant = () => {
    const newRestaurant = {
      _id: Date.now().toString(),
      ...formData,
      slug: formData.slug || generateSlug(formData.name),
      rating: 0,
      reviewCount: 0,
      adminId: currentUser?._id,
      createdAt: new Date().toISOString(),
    };
    const updatedRestaurants = [...restaurants, newRestaurant];
    setRestaurants(updatedRestaurants);
    localStorage.setItem("restaurants", JSON.stringify(updatedRestaurants));
    setShowAddModal(false);
    setFormData({
      name: "",
      slug: "",
      tagline: "",
      description: "",
      address: {
        addressLine1: "",
        addressLine2: "",
        areaLocality: "",
        city: "London",
        countyRegion: "Greater London",
        postcode: "",
        country: "United Kingdom",
        location: { type: "Point", coordinates: [0, 51.5074] },
      },
      contactNumber: "",
      email: "",
      website: "",
      categories: [],
      status: "draft",
      isActive: true,
      isFeatured: false,
      isTrending: false,
    });
  };

  const handleEditRestaurant = () => {
    const updatedRestaurants = restaurants.map((r) =>
      r._id === selectedRestaurant._id
        ? {
            ...r,
            ...formData,
            slug: formData.slug || generateSlug(formData.name),
          }
        : r,
    );
    setRestaurants(updatedRestaurants);
    localStorage.setItem("restaurants", JSON.stringify(updatedRestaurants));
    setShowEditModal(false);
    setSelectedRestaurant(null);
  };

  const handleDeleteRestaurant = (id) => {
    const updatedRestaurants = restaurants.filter((r) => r._id !== id);
    setRestaurants(updatedRestaurants);
    localStorage.setItem("restaurants", JSON.stringify(updatedRestaurants));
  };

  const openEditModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      slug: restaurant.slug,
      tagline: restaurant.tagline || "",
      description: restaurant.description || "",
      address: restaurant.address || formData.address,
      contactNumber: restaurant.contactNumber || "",
      email: restaurant.email || "",
      website: restaurant.website || "",
      categories: restaurant.categories || [],
      status: restaurant.status || "draft",
      isActive: restaurant.isActive !== false,
      isFeatured: restaurant.isFeatured || false,
      isTrending: restaurant.isTrending || false,
    });
    setShowEditModal(true);
  };

  const filterOptions = [
    ...statusOptions,
    ...allCategories.map((c) => ({
      value: c,
      label: c,
      selected: categoryFilter.includes(c),
    })),
  ];

  const formatAddress = (address) => {
    if (!address) return "";
    if (typeof address === "string") return address;
    return [
      address.addressLine1,
      address.areaLocality,
      address.city,
      address.postcode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <DashboardLayout activeTab="restaurants" pageTitle="Restaurants">
      <DashboardHeader
        title="Restaurants"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setShowAddModal(true)}
        filterOptions={filterOptions}
        onFilterChange={(value) => {
          if (["published", "draft", "blocked"].includes(value)) {
            handleStatusFilterChange(value);
          } else {
            handleCategoryFilterChange(value);
          }
        }}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
      <DashboardContent className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="overflow-x-auto">
          <div className="bg-white rounded-lg shadow min-w-full">
            <Table hoverable>
              <Table.Head className="bg-gray-50">
                <Table.HeadCell>Restaurant</Table.HeadCell>
                <Table.HeadCell>Location</Table.HeadCell>
                <Table.HeadCell>Categories</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Featured</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {paginatedRestaurants.length === 0 ? (
                  <Table.Row>
                    <Table.Cell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No restaurants found
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  paginatedRestaurants.map((restaurant) => (
                    <Table.Row key={restaurant._id} className="bg-white">
                      <Table.Cell className="whitespace-nowrap font-medium">
                        <div className="flex items-center gap-3">
                          {restaurant.coverImage && (
                            <img
                              src={restaurant.coverImage}
                              alt=""
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <div className="text-sm">{restaurant.name}</div>
                            <div className="text-xs text-gray-500 hidden sm:block">
                              {restaurant.tagline}
                            </div>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap text-sm">
                        {formatAddress(restaurant.address)}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-wrap gap-1">
                          {(restaurant.categories || [])
                            .slice(0, 2)
                            .map((cat, i) => (
                              <Badge key={i} color="gray" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          color={
                            restaurant.status === "published"
                              ? "success"
                              : restaurant.status === "blocked"
                                ? "failure"
                                : "warning"
                          }
                        >
                          {restaurant.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-1">
                          {restaurant.isFeatured && (
                            <Badge color="purple">Featured</Badge>
                          )}
                          {restaurant.isTrending && (
                            <Badge color="blue">Trending</Badge>
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <Link to={`/restaurant/${restaurant.slug}`}>
                            <Button size="xs" color="gray">
                              <FaEye className="w-3 h-3" />
                            </Button>
                          </Link>
                          <Button
                            size="xs"
                            color="blue"
                            onClick={() => openEditModal(restaurant)}
                          >
                            <FaPencil className="w-3 h-3" />
                          </Button>
                          <Button
                            size="xs"
                            color="failure"
                            onClick={() =>
                              handleDeleteRestaurant(restaurant._id)
                            }
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

          <Modal
            show={showAddModal}
            onClose={() => setShowAddModal(false)}
            size="lg"
          >
            <Modal.Header>Add New Restaurant</Modal.Header>
            <Modal.Body>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" value="Restaurant Name" />
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
                <div className="col-span-2">
                  <Label htmlFor="tagline" value="Tagline" />
                  <TextInput
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description" value="Description" />
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="addressLine1" value="Address Line 1" />
                  <TextInput
                    id="addressLine1"
                    value={formData.address.addressLine1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          addressLine1: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="areaLocality" value="Area/Locality" />
                  <TextInput
                    id="areaLocality"
                    value={formData.address.areaLocality}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          areaLocality: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="city" value="City" />
                  <TextInput
                    id="city"
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="postcode" value="Postcode" />
                  <TextInput
                    id="postcode"
                    value={formData.address.postcode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          postcode: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="contactNumber" value="Contact Number" />
                  <TextInput
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email" value="Email" />
                  <TextInput
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="status" value="Status" />
                  <Select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="blocked">Blocked</option>
                  </Select>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleAddRestaurant}>Add Restaurant</Button>
              <Button color="gray" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showEditModal}
            onClose={() => setShowEditModal(false)}
            size="lg"
          >
            <Modal.Header>Edit Restaurant</Modal.Header>
            <Modal.Body>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editName" value="Restaurant Name" />
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
                <div className="col-span-2">
                  <Label htmlFor="editTagline" value="Tagline" />
                  <TextInput
                    id="editTagline"
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editStatus" value="Status" />
                  <Select
                    id="editStatus"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="blocked">Blocked</option>
                  </Select>
                </div>
                <div className="flex gap-4 items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isFeatured: e.target.checked,
                        })
                      }
                      className="rounded text-[#8fa31e]"
                    />
                    <span>Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isTrending}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isTrending: e.target.checked,
                        })
                      }
                      className="rounded text-[#8fa31e]"
                    />
                    <span>Trending</span>
                  </label>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleEditRestaurant}>Save Changes</Button>
              <Button color="gray" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </DashboardContent>
    </DashboardLayout>
  );
}
