import { useSelector } from 'react-redux'

export default function AdminDashboard() {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser?.userName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">My Restaurant</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="w-12 h-12 bg-[#8fa31e]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#8fa31e] text-xl">🍽️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Menu Items</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="w-12 h-12 bg-[#8fa31e]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#8fa31e] text-xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="w-12 h-12 bg-[#8fa31e]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#8fa31e] text-xl">📁</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Reviews</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="w-12 h-12 bg-[#8fa31e]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#8fa31e] text-xl">⭐</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-[#8fa31e] text-white rounded-lg hover:bg-[#7a8c1a] transition-colors">
            Add Menu Item
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Manage Categories
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            View Reviews
          </button>
        </div>
      </div>
    </div>
  )
}
