import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function UserOverview() {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back, {currentUser?.userName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">My Reviews</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="w-12 h-12 bg-[#8fa31e]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#8fa31e] text-xl">⭐</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/dashboard/reviews" className="text-sm text-[#8fa31e] hover:underline">
              View all reviews →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Favorites</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-xl">❤️</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/restaurants" className="text-sm text-[#8fa31e] hover:underline">
              Browse restaurants →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Profile</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">👤</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/dashboard/profile" className="text-sm text-[#8fa31e] hover:underline">
              Edit profile →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-[#8fa31e]/10 rounded-full flex items-center justify-center">
                <span className="text-[#8fa31e]">⭐</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">No reviews yet</p>
                <p className="text-xs text-gray-500">Your reviews will appear here</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/dashboard/reviews" className="text-sm text-[#8fa31e] hover:underline">
              View all reviews →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link 
              to="/restaurants" 
              className="px-4 py-3 bg-[#8fa31e] text-white rounded-lg hover:bg-[#7a8c1a] transition-colors text-sm font-medium text-center"
            >
              Browse Restaurants
            </Link>
            <Link 
              to="/dashboard/profile" 
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium text-center"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
