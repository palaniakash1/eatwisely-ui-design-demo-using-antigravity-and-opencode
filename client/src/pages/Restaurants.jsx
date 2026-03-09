import { useState } from 'react'
import { TextInput, Select, Label } from 'flowbite-react'
import { HiSearch } from 'react-icons/hi'
import restaurantsData from '../data/restaurants.json'
import RestaurantCard from '../components/RestaurantCard'

export default function Restaurants() {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('rating')

  const categories = [...new Set(restaurantsData.flatMap((r) => r.categories || [r.category]).filter(Boolean))]

  const filteredRestaurants = restaurantsData
    .filter((restaurant) => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.tagline.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !category || (restaurant.categories || []).includes(category) || restaurant.category === category
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#8fa31e] py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-6">Find Restaurants</h1>
          
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <TextInput
                  type="text"
                  placeholder="Search restaurants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={HiSearch}
                  className="w-full"
                />
              </div>
              <div>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="name">Alphabetical</option>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">{filteredRestaurants.length} restaurants found</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No restaurants found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
