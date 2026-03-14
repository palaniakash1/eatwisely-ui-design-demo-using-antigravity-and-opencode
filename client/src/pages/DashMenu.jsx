import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table, Badge, Button, TextInput, Label, Modal, Select, Textarea, Checkbox } from 'flowbite-react'
import { FaPencil, FaPlus, FaTrash } from "react-icons/fa6";
import {
  DashboardHeader,
  DashboardContent,
} from "../components/DashboardLayout";
import { useToast } from "../components/Toast";
import restaurantsData from "../data/restaurants.json";

const ALLERGEN_OPTIONS = [
  { value: 'gluten', label: 'Gluten' },
  { value: 'egg', label: 'Egg' },
  { value: 'fish', label: 'Fish' },
  { value: 'crustaceans', label: 'Crustaceans' },
  { value: 'molluscs', label: 'Molluscs' },
  { value: 'milk', label: 'Milk' },
  { value: 'peanut', label: 'Peanut' },
  { value: 'tree_nuts', label: 'Tree Nuts' },
  { value: 'sesame', label: 'Sesame' },
  { value: 'soya', label: 'Soya' },
  { value: 'celery', label: 'Celery' },
  { value: 'mustard', label: 'Mustard' },
  { value: 'sulphites', label: 'Sulphites' },
  { value: 'lupin', label: 'Lupin' }
];

const NUTRITION_LEVELS = [
  { value: 'green', label: 'Green (Low)', color: 'success' },
  { value: 'amber', label: 'Amber (Medium)', color: 'warning' },
  { value: 'red', label: 'Red (High)', color: 'failure' }
];

const defaultMenuItems = [
  { 
    _id: '1', 
    name: 'Butter Chicken', 
    description: 'Creamy tomato curry with tender chicken', 
    price: 15.99, 
    category: 'Main Course', 
    restaurantId: '1', 
    isAvailable: true, 
    createdAt: '2025-01-01',
    dietary: { vegetarian: false, vegan: false },
    ingredients: [
      { name: 'Chicken', allergens: [], strict: false, removable: true },
      { name: 'Tomato sauce', allergens: ['milk'], strict: false, removable: true },
      { name: 'Cream', allergens: ['milk'], strict: false, removable: true }
    ],
    nutrition: {
      calories: { value: 650, level: 'red' },
      fat: { value: 35, level: 'red' },
      saturates: { value: 15, level: 'red' },
      sugar: { value: 12, level: 'amber' },
      salt: { value: 2.5, level: 'red' }
    },
    upsells: [
      { label: 'Extra Naan', price: 2.50 }
    ],
    isMeal: true
  },
  { 
    _id: '2', 
    name: 'Garlic Naan', 
    description: 'Freshly baked bread with garlic and butter', 
    price: 3.99, 
    category: 'Breads', 
    restaurantId: '1', 
    isAvailable: true, 
    createdAt: '2025-01-01',
    dietary: { vegetarian: true, vegan: false },
    ingredients: [
      { name: 'Flour', allergens: ['gluten'], strict: true, removable: false },
      { name: 'Garlic', allergens: [], strict: true, removable: false },
      { name: 'Butter', allergens: ['milk'], strict: true, removable: false }
    ],
    nutrition: {
      calories: { value: 280, level: 'amber' },
      fat: { value: 8, level: 'amber' },
      saturates: { value: 3, level: 'amber' },
      sugar: { value: 2, level: 'green' },
      salt: { value: 0.8, level: 'green' }
    },
    isMeal: false
  },
  { 
    _id: '3', 
    name: 'Paneer Tikka', 
    description: 'Grilled cottage cheese with spices', 
    price: 12.99, 
    category: 'Starters', 
    restaurantId: '1', 
    isAvailable: true, 
    createdAt: '2025-01-01',
    dietary: { vegetarian: true, vegan: false },
    ingredients: [
      { name: 'Paneer', allergens: ['milk'], strict: false, removable: true },
      { name: 'Yogurt', allergens: ['milk'], strict: false, removable: true },
      { name: 'Spices', allergens: [], strict: false, removable: true }
    ],
    isMeal: false
  },
]

export default function DashMenu() {
  const { currentUser } = useSelector((state) => state.user)
  const toast = useToast()
  const [menuItems, setMenuItems] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [categories, setCategories] = useState([])
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
    image: '',
    price: '',
    category: '',
    restaurantId: '',
    isAvailable: true,
    isMeal: false,
    dietary: {
      vegetarian: false,
      vegan: false
    },
    ingredients: [],
    nutrition: {
      calories: { value: '', level: 'green' },
      fat: { value: '', level: 'green' },
      saturates: { value: '', level: 'green' },
      sugar: { value: '', level: 'green' },
      salt: { value: '', level: 'green' }
    },
    upsells: []
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
    const restData = storedRestaurants ? JSON.parse(storedRestaurants) : restaurantsData
    setRestaurants(restData)
    
    const storedCategories = localStorage.getItem('categories')
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories))
    }
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

  const resetFormData = () => ({
    name: '',
    description: '',
    image: '',
    price: '',
    category: '',
    restaurantId: '',
    isAvailable: true,
    isMeal: false,
    dietary: {
      vegetarian: false,
      vegan: false
    },
    ingredients: [],
    nutrition: {
      calories: { value: '', level: 'green' },
      fat: { value: '', level: 'green' },
      saturates: { value: '', level: 'green' },
      sugar: { value: '', level: 'green' },
      salt: { value: '', level: 'green' }
    },
    upsells: []
  })

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', allergens: [], strict: false, removable: true }]
    })
  }

  const updateIngredient = (index, field, value) => {
    const updated = [...formData.ingredients]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, ingredients: updated })
  }

  const removeIngredient = (index) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    })
  }

  const addUpsell = () => {
    setFormData({
      ...formData,
      upsells: [...formData.upsells, { label: '', price: '' }]
    })
  }

  const updateUpsell = (index, field, value) => {
    const updated = [...formData.upsells]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, upsells: updated })
  }

  const removeUpsell = (index) => {
    setFormData({
      ...formData,
      upsells: formData.upsells.filter((_, i) => i !== index)
    })
  }

  const handleAddMenuItem = () => {
    const newItem = {
      _id: Date.now().toString(),
      ...formData,
      price: parseFloat(formData.price),
      upsells: formData.upsells.map(u => ({
        ...u,
        price: parseFloat(u.price) || 0
      })),
      createdAt: new Date().toISOString()
    }
    const updatedMenu = [...menuItems, newItem]
    setMenuItems(updatedMenu)
    localStorage.setItem('menuItems', JSON.stringify(updatedMenu))
    setShowAddModal(false)
    setFormData(resetFormData())
    toast.success("Menu item added successfully!")
  }

  const handleEditMenuItem = () => {
    const updatedMenu = menuItems.map(item => 
      item._id === selectedItem._id ? { 
        ...item, 
        ...formData,
        price: parseFloat(formData.price),
        upsells: formData.upsells.map(u => ({
          ...u,
          price: parseFloat(u.price) || 0
        }))
      } : item
    )
    setMenuItems(updatedMenu)
    localStorage.setItem('menuItems', JSON.stringify(updatedMenu))
    setShowEditModal(false)
    setSelectedItem(null)
    setFormData(resetFormData())
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
      name: item.name || '',
      description: item.description || '',
      image: item.image || '',
      price: item.price?.toString() || '',
      category: item.category || '',
      restaurantId: item.restaurantId || '',
      isAvailable: item.isAvailable ?? true,
      isMeal: item.isMeal ?? false,
      dietary: item.dietary || { vegetarian: false, vegan: false },
      ingredients: item.ingredients || [],
      nutrition: item.nutrition || {
        calories: { value: '', level: 'green' },
        fat: { value: '', level: 'green' },
        saturates: { value: '', level: 'green' },
        sugar: { value: '', level: 'green' },
        salt: { value: '', level: 'green' }
      },
      upsells: item.upsells || []
    })
    setShowEditModal(true)
  }

  const renderMenuItemForm = (isEdit = false) => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" value="Item Name *" />
          <TextInput id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div>
          <Label htmlFor="price" value="Price * (GBP)" />
          <TextInput id="price" type="number" step="0.01" min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
        </div>
      </div>

      <div>
        <Label htmlFor="description" value="Description" />
        <Textarea id="description" rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="image" value="Image URL" />
          <TextInput id="image" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
        </div>
        <div>
          <Label htmlFor="restaurant" value="Restaurant *" />
          <Select id="restaurant" value={formData.restaurantId} onChange={(e) => setFormData({...formData, restaurantId: e.target.value})} required>
            <option value="">Select Restaurant</option>
            {restaurants.map(r => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="category" value="Category" />
          <TextInput id="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g. Starters" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={formData.isAvailable} 
            onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})} 
            className="rounded text-[#8fa31e]" 
          />
          <span className="text-sm">Available</span>
        </label>
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={formData.isMeal} 
            onChange={(e) => setFormData({...formData, isMeal: e.target.checked})} 
            className="rounded text-[#8fa31e]" 
          />
          <span className="text-sm">Is Meal</span>
        </label>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Dietary Options</h4>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={formData.dietary.vegetarian} 
              onChange={(e) => setFormData({...formData, dietary: {...formData.dietary, vegetarian: e.target.checked}})} 
              className="rounded text-[#8fa31e]" 
            />
            <span className="text-sm">Vegetarian</span>
          </label>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={formData.dietary.vegan} 
              onChange={(e) => setFormData({...formData, dietary: {...formData.dietary, vegan: e.target.checked}})} 
              className="rounded text-[#8fa31e]" 
            />
            <span className="text-sm">Vegan</span>
          </label>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium">Ingredients</h4>
          <Button size="xs" onClick={addIngredient}>
            <FaPlus className="w-3 h-3 mr-1" /> Add Ingredient
          </Button>
        </div>
        {formData.ingredients.length === 0 ? (
          <p className="text-sm text-gray-500">No ingredients added yet</p>
        ) : (
          <div className="space-y-3">
            {formData.ingredients.map((ing, idx) => (
              <div key={idx} className="flex flex-wrap items-end gap-2 p-3 bg-gray-50 rounded">
                <div className="flex-1 min-w-[150px]">
                  <Label value="Name" className="text-xs" />
                  <TextInput 
                    value={ing.name} 
                    onChange={(e) => updateIngredient(idx, 'name', e.target.value)} 
                    placeholder="Ingredient name"
                    className="mb-0"
                  />
                </div>
                <div className="min-w-[200px]">
                  <Label value="Allergens" className="text-xs" />
                  <Select 
                    value={ing.allergens.join(',')} 
                    onChange={(e) => updateIngredient(idx, 'allergens', e.target.value ? e.target.value.split(',') : [])}
                    className="mb-0"
                  >
                    <option value="">None</option>
                    {ALLERGEN_OPTIONS.map(a => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </Select>
                </div>
                <label className="flex items-center gap-1 text-xs">
                  <input 
                    type="checkbox" 
                    checked={ing.strict} 
                    onChange={(e) => updateIngredient(idx, 'strict', e.target.checked)}
                    className="rounded text-[#8fa31e]" 
                  />
                  Strict
                </label>
                <label className="flex items-center gap-1 text-xs">
                  <input 
                    type="checkbox" 
                    checked={ing.removable} 
                    onChange={(e) => updateIngredient(idx, 'removable', e.target.checked)}
                    className="rounded text-[#8fa31e]" 
                  />
                  Removable
                </label>
                <button onClick={() => removeIngredient(idx)} className="text-red-500 p-2">
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Nutrition Information (optional)</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['calories', 'fat', 'saturates', 'sugar', 'salt'].map((nutrient) => (
            <div key={nutrient} className="p-2 border rounded">
              <Label value={nutrient.charAt(0).toUpperCase() + nutrient.slice(1)} className="text-xs capitalize" />
              <TextInput 
                type="number" 
                step="0.1" 
                min="0"
                value={formData.nutrition[nutrient]?.value || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  nutrition: {
                    ...formData.nutrition,
                    [nutrient]: { ...formData.nutrition[nutrient], value: e.target.value }
                  }
                })}
                className="mb-1"
                placeholder="Value"
              />
              <Select 
                value={formData.nutrition[nutrient]?.level || 'green'}
                onChange={(e) => setFormData({
                  ...formData,
                  nutrition: {
                    ...formData.nutrition,
                    [nutrient]: { ...formData.nutrition[nutrient], level: e.target.value }
                  }
                })}
                className="text-xs"
              >
                {NUTRITION_LEVELS.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium">Upsells / Add-ons</h4>
          <Button size="xs" onClick={addUpsell}>
            <FaPlus className="w-3 h-3 mr-1" /> Add Upsell
          </Button>
        </div>
        {formData.upsells.length === 0 ? (
          <p className="text-sm text-gray-500">No upsells added yet</p>
        ) : (
          <div className="space-y-2">
            {formData.upsells.map((upsell, idx) => (
              <div key={idx} className="flex gap-2 items-center p-2 bg-gray-50 rounded">
                <TextInput 
                  value={upsell.label} 
                  onChange={(e) => updateUpsell(idx, 'label', e.target.value)}
                  placeholder="Label (e.g. Extra Cheese)"
                  className="flex-1"
                />
                <TextInput 
                  type="number"
                  step="0.01"
                  min="0"
                  value={upsell.price} 
                  onChange={(e) => updateUpsell(idx, 'price', e.target.value)}
                  placeholder="Price"
                  className="w-24"
                />
                <button onClick={() => removeUpsell(idx)} className="text-red-500 p-2">
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

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
                <Table.HeadCell>Dietary</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {paginatedItems.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={7} className="text-center py-8 text-gray-500">
                      No menu items found
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  paginatedItems.map((item) => (
                    <Table.Row key={item._id} className="bg-white">
                      <Table.Cell className="font-medium">
                        <div className="text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{item.description}</div>
                      </Table.Cell>
                      <Table.Cell className="text-sm">{getRestaurantName(item.restaurantId)}</Table.Cell>
                      <Table.Cell><Badge color="gray">{item.category}</Badge></Table.Cell>
                      <Table.Cell className="font-medium">£{parseFloat(item.price).toFixed(2)}</Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-1">
                          {item.dietary?.vegetarian && <Badge color="success" size="xs">V</Badge>}
                          {item.dietary?.vegan && <Badge color="success" size="xs">VG</Badge>}
                          {item.isMeal && <Badge color="info" size="xs">Meal</Badge>}
                        </div>
                      </Table.Cell>
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

        <Modal show={showAddModal} onClose={() => { setShowAddModal(false); setFormData(resetFormData()) }} size="2xl">
          <Modal.Header>Add Menu Item</Modal.Header>
          <Modal.Body>
            {renderMenuItemForm(false)}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleAddMenuItem}>Add Item</Button>
            <Button color="gray" onClick={() => { setShowAddModal(false); setFormData(resetFormData()) }}>Cancel</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showEditModal} onClose={() => { setShowEditModal(false); setSelectedItem(null); setFormData(resetFormData()) }} size="2xl">
          <Modal.Header>Edit Menu Item</Modal.Header>
          <Modal.Body>
            {renderMenuItemForm(true)}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleEditMenuItem}>Save Changes</Button>
            <Button color="gray" onClick={() => { setShowEditModal(false); setSelectedItem(null); setFormData(resetFormData()) }}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </DashboardContent>
    </>
  )
}