import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table, Badge, Button, TextInput, Label, Modal, Select } from 'flowbite-react'
import { HiPencil, HiTrash, HiSearch, HiOutlineExclamationCircle } from 'react-icons/hi'
import { DashboardLayout, DashboardHeader, DashboardContent } from '../components/DashboardLayout'
import usersData from '../data/users.json'
import restaurantsData from '../data/restaurants.json'

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user)
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    role: 'user',
    isActive: true
  })
  const [roleFilter, setRoleFilter] = useState([])
  const [statusFilter, setStatusFilter] = useState([])

  useEffect(() => {
    const storedUsers = localStorage.getItem('users')
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    } else {
      setUsers(usersData)
      localStorage.setItem('users', JSON.stringify(usersData))
    }
  }, [])

  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'storeManager', label: 'Store Manager' },
    { value: 'admin', label: 'Admin' },
    { value: 'superAdmin', label: 'Super Admin' },
  ]

  const statusOptions = [
    { value: 'active', label: 'Active', selected: statusFilter.includes('active') },
    { value: 'inactive', label: 'Inactive', selected: statusFilter.includes('inactive') },
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter.length === 0 || roleFilter.includes(user.role)
    const matchesStatus = statusFilter.length === 0 || 
      (statusFilter.includes('active') && user.isActive) ||
      (statusFilter.includes('inactive') && !user.isActive)
    return matchesSearch && matchesRole && matchesStatus
  })

  const totalItems = filteredUsers.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const handleRoleFilterChange = (value) => {
    setRoleFilter(prev => 
      prev.includes(value) 
        ? prev.filter(r => r !== value)
        : [...prev, value]
    )
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (value) => {
    setStatusFilter(prev => 
      prev.includes(value) 
        ? prev.filter(s => s !== value)
        : [...prev, value]
    )
    setCurrentPage(1)
  }

  const handleAddUser = () => {
    const newUser = {
      _id: Date.now().toString(),
      ...formData,
      userName: formData.userName.toLowerCase(),
      email: formData.email.toLowerCase(),
      profilePicture: 'https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740&q=80',
      restaurantId: null,
      createdByAdminId: currentUser?._id,
      createdAt: new Date().toISOString()
    }
    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    setShowAddModal(false)
    setFormData({ userName: '', email: '', password: '', role: 'user', isActive: true })
  }

  const handleEditUser = () => {
    const updatedUsers = users.map(u => 
      u._id === selectedUser._id 
        ? { ...u, ...formData, userName: formData.userName.toLowerCase(), email: formData.email.toLowerCase() }
        : u
    )
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    setShowEditModal(false)
    setSelectedUser(null)
  }

  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter(u => u._id !== userId)
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setFormData({
      userName: user.userName,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive
    })
    setShowEditModal(true)
  }

  const filterOptions = [
    ...roleOptions.map(o => ({ value: o.value, label: o.label, selected: roleFilter.includes(o.value) })),
    ...statusOptions
  ]

  return (
    <DashboardLayout activeTab="users" pageTitle="Users">
      <DashboardHeader
        title="Users"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setShowAddModal(true)}
        filterOptions={filterOptions}
        onFilterChange={(value) => {
          if (roleOptions.some(o => o.value === value)) {
            handleRoleFilterChange(value)
          } else {
            handleStatusFilterChange(value)
          }
        }}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => {
          setCurrentPage(page)
          if (page === 1 && document.querySelector('select')) {
            setItemsPerPage(parseInt(document.querySelector('select').value) || 10)
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
              {paginatedUsers.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center py-8 text-gray-500">
                    No users found
                  </Table.Cell>
                </Table.Row>
              ) : (
                paginatedUsers.map((user) => (
                  <Table.Row key={user._id} className="bg-white">
                    <Table.Cell className="whitespace-nowrap font-medium">
                      <div className="flex items-center gap-3">
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#8fa31e] flex items-center justify-center text-white text-sm">
                            {user.userName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {user.userName}
                      </div>
                    </Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      <Badge color={user.role === 'superAdmin' ? 'purple' : user.role === 'admin' ? 'blue' : 'gray'}>
                        {user.role}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={user.isActive ? 'success' : 'failure'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <Button size="xs" color="blue" onClick={() => openEditModal(user)}>
                          <HiPencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="xs" 
                          color="failure" 
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={user._id === currentUser?._id}
                        >
                          <HiTrash className="w-4 h-4" />
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
              <div>
                <Label htmlFor="userName" value="Username" />
                <TextInput
                  id="userName"
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="password" value="Password" />
                <TextInput
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <Label htmlFor="role" value="Role" />
                <Select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  {roleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleAddUser}>Add User</Button>
            <Button color="gray" onClick={() => setShowAddModal(false)}>Cancel</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
          <Modal.Header>Edit User</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editUserName" value="Username" />
                <TextInput
                  id="editUserName"
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editEmail" value="Email" />
                <TextInput
                  id="editEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editPassword" value="Password (leave blank to keep current)" />
                <TextInput
                  id="editPassword"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="New password"
                />
              </div>
              <div>
                <Label htmlFor="editRole" value="Role" />
                <Select
                  id="editRole"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  {roleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleEditUser}>Save Changes</Button>
            <Button color="gray" onClick={() => setShowEditModal(false)}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </DashboardContent>
    </DashboardLayout>
  )
}
