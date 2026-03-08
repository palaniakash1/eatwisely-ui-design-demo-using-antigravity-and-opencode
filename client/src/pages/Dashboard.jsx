import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Card, Table } from 'flowbite-react'

export default function Dashboard() {
  const { currentUser } = useSelector((state) => state.user)
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-[#f1f8eb]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <h5 className="text-gray-500 text-sm">Total Restaurants</h5>
            <p className="text-2xl font-bold">0</p>
          </Card>
          <Card>
            <h5 className="text-gray-500 text-sm">Reviews Written</h5>
            <p className="text-2xl font-bold">0</p>
          </Card>
          <Card>
            <h5 className="text-gray-500 text-sm">Favorites</h5>
            <p className="text-2xl font-bold">0</p>
          </Card>
          <Card>
            <h5 className="text-gray-500 text-sm">Account Status</h5>
            <p className="text-2xl font-bold text-green-500">Active</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-bold mb-4">Welcome, {currentUser?.username || 'User'}!</h2>
          <p className="text-gray-600 mb-4">
            This is your personal dashboard. Here you can manage your restaurants, 
            view analytics, and update your profile.
          </p>
          <p className="text-gray- features coming soon!
600">
            More          </p>
        </Card>
      </div>
    </div>
  )
}
