import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  Badge,
  Button,
  TextInput,
  Label,
  Modal,
  Select,
} from "flowbite-react";
import { FaTrash, FaSearch, FaExclamation } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useToast } from "../components/Toast";
import {
  DashboardHeader,
  DashboardContent,
  DashboardLayout,
} from "../components/DashboardLayout";
import { getAllUsers, createUser, updateUserInJson, deleteUserFromJson } from "../services/userApi";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "user",
    isActive: true,
    profilePicture: "",
  });
  const [roleFilter, setRoleFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const defaultProfilePicture = "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740&q=80";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      if (data.success && data.data) {
        setUsers(data.data);
      } else if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const roleOptions = [
    { value: "user", label: "User" },
    { value: "storeManager", label: "Store Manager" },
    { value: "admin", label: "Admin" },
    { value: "superAdmin", label: "Super Admin" },
  ];

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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter.length === 0 || roleFilter.includes(user.role);
    const matchesStatus =
      statusFilter.length === 0 ||
      (statusFilter.includes("active") && user.isActive) ||
      (statusFilter.includes("inactive") && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleRoleFilterChange = (value) => {
    setRoleFilter((prev) =>
      prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value],
    );
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );
    setCurrentPage(1);
  };

  const handleAddUser = async () => {
    try {
      const newUserData = {
        ...formData,
        userName: formData.userName.toLowerCase(),
        email: formData.email.toLowerCase(),
        profilePicture: formData.profilePicture || defaultProfilePicture,
      };
      
      await createUser(newUserData);
      toast.success("User added successfully!");
      setShowAddModal(false);
      setFormData({
        userName: "",
        email: "",
        password: "",
        role: "user",
        isActive: true,
        profilePicture: "",
      });
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Failed to add user");
    }
  };

  const handleEditUser = async () => {
    try {
      const updates = {
        ...formData,
        userName: formData.userName.toLowerCase(),
        email: formData.email.toLowerCase(),
        profilePicture: formData.profilePicture || selectedUser?.profilePicture || defaultProfilePicture,
      };
      
      await updateUserInJson(selectedUser._id, updates);
      toast.success("User updated successfully!");
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUserFromJson(userId);
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      userName: user.userName,
      email: user.email,
      password: "",
      role: user.role,
      isActive: user.isActive,
      profilePicture: user.profilePicture || "",
    });
    setShowEditModal(true);
  };

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (isEdit) {
        setFormData({ ...formData, profilePicture: reader.result });
      } else {
        setFormData({ ...formData, profilePicture: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const filterOptions = [
    ...roleOptions.map((o) => ({
      value: o.value,
      label: o.label,
      selected: roleFilter.includes(o.value),
    })),
    ...statusOptions,
  ];

  return (
    <DashboardLayout activeTab="users" pageTitle="Users">
      <DashboardHeader
        title="Users"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setShowAddModal(true)}
        filterOptions={filterOptions}
        onFilterChange={(value) => {
          if (roleOptions.some((o) => o.value === value)) {
            handleRoleFilterChange(value);
          } else {
            handleStatusFilterChange(value);
          }
        }}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          if (page === 1 && document.querySelector("select")) {
            setItemsPerPage(
              parseInt(document.querySelector("select").value) || 10,
            );
          }
        }}
      />
      <DashboardContent>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table hoverable>
            <Table.Head className="bg-gray-50">
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Role</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Created</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center py-8 text-gray-500">
                    Loading users...
                  </Table.Cell>
                </Table.Row>
              ) : paginatedUsers.length === 0 ? (
                <Table.Row>
                  <Table.Cell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No users found
                  </Table.Cell>
                </Table.Row>
              ) : (
                paginatedUsers.map((user) => (
                  <Table.Row key={user._id} className="bg-white">
                    <Table.Cell className="whitespace-nowrap font-medium">
                      <div className="flex items-center gap-3">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#8fa31e] flex items-center justify-center text-white text-sm">
                            {user.userName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="hidden sm:inline">
                          {user.userName}
                        </span>
                        <span className="sm:hidden">
                          {user.userName?.slice(0, 10)}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap">
                      {user.email}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={
                          user.role === "superAdmin"
                            ? "purple"
                            : user.role === "admin"
                              ? "blue"
                              : "gray"
                        }
                      >
                        {user.role}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={user.isActive ? "success" : "failure"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="xs"
                          color="blue"
                          onClick={() => openEditModal(user)}
                        >
                          <FaPencil className="w-3 h-3" />
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={user._id === currentUser?._id}
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

        <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
          <Modal.Header>Add New User</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
                    <img
                      src={formData.profilePicture || defaultProfilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 bg-[#8fa31e] text-white p-2 rounded-full hover:bg-[#7a8c1a] transition-colors"
                  >
                    <FaPencil className="w-3 h-3" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, false)}
                    className="hidden"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="userName" value="Username" />
                <TextInput
                  id="userName"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="password" value="Password" />
                <TextInput
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
              </div>
              <div>
                <Label htmlFor="role" value="Role" />
                <Select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  {roleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleAddUser}>Add User</Button>
            <Button color="gray" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
          <Modal.Header>Edit User</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
                    <img
                      src={formData.profilePicture || selectedUser?.profilePicture || defaultProfilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current.click()}
                    className="absolute bottom-0 right-0 bg-[#8fa31e] text-white p-2 rounded-full hover:bg-[#7a8c1a] transition-colors"
                  >
                    <FaPencil className="w-3 h-3" />
                  </button>
                  <input
                    type="file"
                    ref={editFileInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, true)}
                    className="hidden"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editUserName" value="Username" />
                <TextInput
                  id="editUserName"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editEmail" value="Email" />
                <TextInput
                  id="editEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label
                  htmlFor="editPassword"
                  value="Password (leave blank to keep current)"
                />
                <TextInput
                  id="editPassword"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="New password"
                />
              </div>
              <div>
                <Label htmlFor="editRole" value="Role" />
                <Select
                  id="editRole"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  {roleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleEditUser}>Save Changes</Button>
            <Button color="gray" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </DashboardContent>
    </DashboardLayout>
  );
}
