import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaUsers, FaUtensils, FaTags, FaList, FaCog, FaScroll, FaSignOutAlt, FaBars, FaTimes, FaUser } from 'react-icons/fa'

const menuItems = [
  { id: 'users', label: 'Users', icon: FaUsers, path: '/dashboard/users' },
  { id: 'restaurants', label: 'Restaurants', icon: FaUtensils, path: '/dashboard/restaurants' },
  { id: 'categories', label: 'Categories', icon: FaTags, path: '/dashboard/categories' },
  { id: 'menu', label: 'Menu', icon: FaList, path: '/dashboard/menu' },
  { id: 'auditlog', label: 'Audit Log', icon: FaScroll, path: '/dashboard/auditlog' },
  { id: 'profile', label: 'Profile', icon: FaUser, path: '/dashboard/profile' },
]

const bottomMenuItems = [
  { id: 'settings', label: 'Settings', icon: FaCog, path: '/dashboard/settings' },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const getActiveTab = () => {
    const path = location.pathname
    if (path.includes('/users')) return 'users'
    if (path.includes('/restaurants')) return 'restaurants'
    if (path.includes('/categories')) return 'categories'
    if (path.includes('/menu')) return 'menu'
    if (path.includes('/auditlog')) return 'auditlog'
    if (path.includes('/settings')) return 'settings'
    if (path.includes('/profile')) return 'profile'
    return 'users'
  }

  const activeTab = getActiveTab()

  const handleSignOut = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#8fa31e]">EatWisely</span>
          </Link>
          <button 
            onClick={closeSidebar}
            className="lg:hidden p-1"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-[#8fa31e] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-3">
          {bottomMenuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-[#8fa31e] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center gap-3 px-2 py-2">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#8fa31e] flex items-center justify-center text-white font-semibold">
                  {user?.userName?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.userName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full mt-3 flex items-center justify-end gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span>Sign Out</span>
              <FaSignOutAlt className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 mr-4"
          >
            <FaBars className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#8fa31e]">EatWisely</span>
          </Link>
        </div>

        <main className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
