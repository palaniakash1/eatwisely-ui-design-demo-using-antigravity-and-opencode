import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, Badge, Button, TextInput } from 'flowbite-react';
import { FaSearch, FaPlus, FaTrash } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';

const defaultStoreManagers = [
  {
    _id: '1',
    userName: 'manager_one',
    email: 'manager1@example.com',
    isActive: true,
    createdAt: '2025-01-10'
  },
  {
    _id: '2',
    userName: 'manager_two',
    email: 'manager2@example.com',
    isActive: true,
    createdAt: '2025-01-08'
  },
  {
    _id: '3',
    userName: 'manager_three',
    email: 'manager3@example.com',
    isActive: false,
    createdAt: '2025-01-05'
  }
];

export default function AdminStoreManagers() {
  const { currentUser } = useSelector((state) => state.user);
  const [managers, setManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const storedManagers = localStorage.getItem(
      `admin_store_managers_${currentUser?._id}`
    );
    if (storedManagers) {
      setManagers(JSON.parse(storedManagers));
    } else {
      setManagers(defaultStoreManagers);
      localStorage.setItem(
        `admin_store_managers_${currentUser?._id}`,
        JSON.stringify(defaultStoreManagers)
      );
    }
  }, [currentUser]);

  const filteredManagers = managers.filter((manager) => {
    const matchesSearch =
      manager.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalItems = filteredManagers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedManagers = filteredManagers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleToggleStatus = (id) => {
    const updatedManagers = managers.map((m) =>
      m._id === id ? { ...m, isActive: !m.isActive } : m
    );
    setManagers(updatedManagers);
    localStorage.setItem(
      `admin_store_managers_${currentUser?._id}`,
      JSON.stringify(updatedManagers)
    );
  };

  const handleDeleteManager = (id) => {
    const updatedManagers = managers.filter((m) => m._id !== id);
    setManagers(updatedManagers);
    localStorage.setItem(
      `admin_store_managers_${currentUser?._id}`,
      JSON.stringify(updatedManagers)
    );
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Managers</p>
          <p className="text-2xl font-bold text-gray-800">{managers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Active Managers</p>
          <p className="text-2xl font-bold text-gray-800">
            {managers.filter((m) => m.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Inactive Managers</p>
          <p className="text-2xl font-bold text-gray-800">
            {managers.filter((m) => !m.isActive).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-800">Store Managers</h2>
            <Badge color="gray">{totalItems} total</Badge>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <TextInput
                placeholder="Search managers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Button color="green" onClick={() => setShowAddModal(true)}>
              <FaPlus className="w-4 h-4 mr-2" />
              Add Manager
            </Button>
          </div>
        </div>

        <Table hoverable>
          <Table.Head className="bg-gray-50">
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Created</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {paginatedManagers.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No store managers found
                </Table.Cell>
              </Table.Row>
            ) : (
              paginatedManagers.map((manager) => (
                <Table.Row key={manager._id} className="bg-white">
                  <Table.Cell className="font-medium">
                    {manager.userName}
                  </Table.Cell>
                  <Table.Cell>{manager.email}</Table.Cell>
                  <Table.Cell>
                    <Badge color={manager.isActive ? 'success' : 'failure'}>
                      {manager.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap">
                    {new Date(manager.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Button size="xs" color="blue">
                        <FaPencil className="w-3 h-3" />
                      </Button>
                      <Button
                        size="xs"
                        color={manager.isActive ? 'warning' : 'success'}
                        onClick={() => handleToggleStatus(manager._id)}
                      >
                        {manager.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => handleDeleteManager(manager._id)}
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
              Showing {startIndex + 1} to{' '}
              {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
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
