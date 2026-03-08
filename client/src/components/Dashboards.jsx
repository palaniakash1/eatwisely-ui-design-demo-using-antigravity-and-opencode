import { useState } from 'react'
import { Card } from 'flowbite-react'
import { HiOutlineRestaurant, HiOutlineUsers, HiOutlineStar, HiOutlineChartBar } from 'react-icons/hi'

export default function Dashboards() {
  const [stats] = useState({
    restaurants: 0,
    users: 0,
    reviews: 0,
    rating: 0
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Restaurants</p>
              <p className="text-2xl font-bold">{stats.restaurants}</p>
            </div>
            <HiOutlineRestaurant className="text-4xl text-[#8fa31e]" />
          </div>
        </Card>
        
        <Card className="bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold">{stats.users}</p>
            </div>
            <HiOutlineUsers className="text-4xl text-[#8fa31e]" />
          </div>
        </Card>
        
        <Card className="bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Reviews</p>
              <p className="text-2xl font-bold">{stats.reviews}</p>
            </div>
            <HiOutlineStar className="text-4xl text-[#8fa31e]" />
          </div>
        </Card>
        
        <Card className="bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Average Rating</p>
              <p className="text-2xl font-bold">{stats.rating}</p>
            </div>
            <HiOutlineChartBar className="text-4xl text-[#8fa31e]" />
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <p className="text-gray-500">No recent activity to display.</p>
      </Card>
    </div>
  )
}
