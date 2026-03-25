import { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { signOut } from '../../redux/user/userSlice'
import { logoutUser } from '../../services/userApi'
import { FaHome, FaStar, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: FaHome, path: '/user-dashboard' },
  { id: 'reviews', label: 'My Reviews', icon: FaStar, path: '/user-dashboard/reviews' },
]

const bottomMenuItems = [
  { id: 'profile', label: 'Profile', icon: FaUser, path: '/user-dashboard/profile' },
]

export default function UserDashboardLayout() {
  const { currentUser, userRole } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const getActiveTab = () => {
    const path = location.pathname
    if (path === '/user-dashboard' || path === '/user-dashboard/') return 'dashboard'
    if (path.includes('/reviews')) return 'reviews'
    if (path.includes('/profile')) return 'profile'
    return 'dashboard'
  }

  const activeTab = getActiveTab()

  const handleSignOut = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error('Logout error:', error)
    }
    dispatch(signOut())
    sessionStorage.removeItem('isLoggingOut')
    navigate('/sign-in')
  }

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

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

        <div className="p-4 border-b border-gray-200">
          <div className="bg-[#8fa31e]/10 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase">Role</p>
            <p className="font-bold text-gray-900">User</p>
          </div>
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

        <div className="p-4 border-t border-gray-200 space-y-1">
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
              {currentUser?.profilePicture ? (
                <img
                  src={currentUser.profilePicture}
                  alt={currentUser.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#8fa31e] flex items-center justify-center text-white font-semibold">
                  {currentUser?.userName?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {currentUser?.userName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.email}
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

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 mr-4"
          >
            <FaBars className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#8fa31e]">EatWisely</span>
            <span className="text-xs bg-[#8fa31e] text-white px-2 py-0.5 rounded">USER</span>
          </Link>
        </div>

        <main className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
