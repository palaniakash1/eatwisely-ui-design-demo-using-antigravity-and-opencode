import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table, Badge, Button, TextInput, Label, Modal, Select } from 'flowbite-react'
import { FaPencil } from "react-icons/fa6";
import {
  DashboardHeader,
  DashboardContent,
  DashboardLayout,
} from "../components/DashboardLayout";
import { FaTrash } from "react-icons/fa";
import { useToast } from "../components/Toast";
import restaurantsData from "../data/restaurants.json";

const defaultMenuItems = [
  { _id: '1', name: 'Butter Chicken', description: 'Creamy tomato curry', price: 15.99, category: 'Main Course', restaurantId: '1', isAvailable: true, createdAt: '2025-01-01' },
  { _id: '2', name: 'Garlic Naan', description: 'Freshly baked bread', price: 3.99, category: 'Breads', restaurantId: '1', isAvailable: true, createdAt: '2025-01-01' },
  { _id: '3', name: 'Paneer Tikka', description: 'Grilled cottage cheese', price: 12.99, category: 'Starters', restaurantId: '1', isAvailable: true, createdAt: '2025-01-01' },
]

export default function DashMenu() {
  const { currentUser } = useSelector((state) => state.user)
  const toast = useToast()
  const [menuItems, setMenuItems] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [statusFilter, setStatusFilter] = useState([])
  const [restaurantFilter, setRestaurantFilter] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    restaurantId: '',
    isAvailable: true
  })

  useEffect(() => {
    const storedMenu = localStorage.getItem('menuItems')
    if (storedMenu) {
      setMenuItems(JSON.parse(storedMenu))
    } else {
      setMenuItems(defaultMenuItems)
      localStorage.setItem('menuItems', JSON.stringify(defaultMenuItems))
    }
    const storedRestaurants = localStorage.getItem('restaurants')
    setRestaurants(storedRestaurants ? JSON.parse(storedRestaurants) : restaurantsData)
  }, [])

  const statusOptions = [
    { value: 'available', label: 'Available', selected: statusFilter.includes('available') },
    { value: 'unavailable', label: 'Unavailable', selected: statusFilter.includes('unavailable') },
  ]

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter.length === 0 || 
      (statusFilter.includes('available') && item.isAvailable) ||
      (statusFilter.includes('unavailable') && !item.isAvailable)
    const matchesRestaurant = restaurantFilter.length === 0 || restaurantFilter.includes(item.restaurantId)
    return matchesSearch && matchesStatus && matchesRestaurant
  })

  const totalItems = filteredMenuItems.length
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filteredMenuItems.slice(startIndex, startIndex + itemsPerPage)

  const getRestaurantName = (id) => {
    const restaurant = restaurants.find(r => r._id === id)
    return restaurant?.name || 'Unknown'
  }

  const handleStatusFilterChange = (value) => {
    setStatusFilter(prev => prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value])
    setCurrentPage(1)
  }

  const handleAddMenuItem = () => {
    const newItem = {
      _id: Date.now().toString(),
      ...formData,
      price: parseFloat(formData.price),
      createdAt: new Date().toISOString()
    }
    const updatedMenu = [...menuItems, newItem]
    setMenuItems(updatedMenu)
    localStorage.setItem('menuItems', JSON.stringify(updatedMenu))
    setShowAddModal(false)
    setFormData({ name: '', description: '', price: '', category: '', restaurantId: '', isAvailable: true })
    toast.success("Menu item added successfully!")
  }

  const handleEditMenuItem = () => {
    const updatedMenu = menuItems.map(item => 
      item._id === selectedItem._id ? { ...item, ...formData, price: parseFloat(formData.price) } : item
    )
    setMenuItems(updatedMenu)
    localStorage.setItem('menuItems', JSON.stringify(updatedMenu))
    setShowEditModal(false)
    setSelectedItem(null)
    toast.success("Menu item updated successfully!")
  }

  const handleDeleteMenuItem = (id) => {
    const updatedMenu = menuItems.filter(item => item._id !== id)
    setMenuItems(updatedMenu)
    localStorage.setItem('menuItems', JSON.stringify(updatedMenu))
    toast.success("Menu item deleted successfully!")
  }

  const openEditModal = (item) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category || '',
      restaurantId: item.restaurantId || '',
      isAvailable: item.isAvailable
    })
    setShowEditModal(true)
  }

  return (
    <>
      <DashboardHeader
        title="Menu Items"
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
                <Table.HeadCell>Item</Table.HeadCell>
                <Table.HeadCell>Restaurant</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {paginatedItems.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center py-8 text-gray-500">
                      No menu items found
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  paginatedItems.map((item) => (
                    <Table.Row key={item._id} className="bg-white">
                      <Table.Cell className="font-medium">
                        <div className="text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </Table.Cell>
                      <Table.Cell className="text-sm">{getRestaurantName(item.restaurantId)}</Table.Cell>
                      <Table.Cell><Badge color="gray">{item.category}</Badge></Table.Cell>
                      <Table.Cell className="font-medium">£{item.price.toFixed(2)}</Table.Cell>
                      <Table.Cell>
                        <Badge color={item.isAvailable ? 'success' : 'failure'}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <Button size="xs" color="blue" onClick={() => openEditModal(item)}>
                            <FaPencil className="w-3 h-3" />
                          </Button>
                          <Button size="xs" color="failure" onClick={() => handleDeleteMenuItem(item._id)}>
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
          <Modal.Header>Add Menu Item</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" value="Item Name" />
                <TextInput id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="description" value="Description" />
                <TextInput id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" value="Price" />
                  <TextInput id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="category" value="Category" />
                  <TextInput id="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g. Starters" />
                </div>
              </div>
              <div>
                <Label htmlFor="restaurant" value="Restaurant" />
                <Select id="restaurant" value={formData.restaurantId} onChange={(e) => setFormData({...formData, restaurantId: e.target.value})}>
                  <option value="">Select Restaurant</option>
                  {restaurants.map(r => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </Select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleAddMenuItem}>Add Item</Button>
            <Button color="gray" onClick={() => setShowAddModal(false)}>Cancel</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
          <Modal.Header>Edit Menu Item</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName" value="Item Name" />
                <TextInput id="editName" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="editDescription" value="Description" />
                <TextInput id="editDescription" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editPrice" value="Price" />
                  <TextInput id="editPrice" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="editCategory" value="Category" />
                  <TextInput id="editCategory" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isAvailable} onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})} className="rounded text-[#8fa31e]" />
                <span>Available</span>
              </label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleEditMenuItem}>Save Changes</Button>
            <Button color="gray" onClick={() => setShowEditModal(false)}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </DashboardContent>
    </>
  )
}
