import { useSelector } from 'react-redux'

export default function SuperAdminOverview() {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back, {currentUser?.userName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="w-12 h-12 bg-[#8fa31e]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#8fa31e] text-xl">👥</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs text-green-600">+0%</span>
            <span className="text-xs text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Restaurants</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="w-12 h-12 bg-[#8fa31e]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#8fa31e] text-xl">🍽️</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs text-green-600">+0%</span>
            <span className="text-xs text-gray-500 ml-2">from last month</span>
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
          <div className="mt-4">
            <span className="text-xs text-green-600">+0%</span>
            <span className="text-xs text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Audit Logs</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="w-12 h-12 bg-[#8fa31e]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#8fa31e] text-xl">📋</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs text-green-600">+0%</span>
            <span className="text-xs text-gray-500 ml-2">from last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-[#8fa31e]/10 rounded-full flex items-center justify-center">
                <span className="text-[#8fa31e]">📝</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">No recent activity</p>
                <p className="text-xs text-gray-500">Activity will appear here</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="px-4 py-3 bg-[#8fa31e] text-white rounded-lg hover:bg-[#7a8c1a] transition-colors text-sm font-medium">
              Create Admin
            </button>
            <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              Manage Restaurants
            </button>
            <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              View Audit Logs
            </button>
            <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              Manage Categories
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
