import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { signOut } from '../redux/user/userSlice'
import { FaUsers, FaUtensils, FaTags, FaList, FaCog, FaScroll, FaSignOutAlt } from 'react-icons/fa'

const menuItems = [
  { id: 'users', label: 'Users', icon: FaUsers, path: '/dashboard/users' },
  { id: 'restaurants', label: 'Restaurants', icon: FaUtensils, path: '/dashboard/restaurants' },
  { id: 'categories', label: 'Categories', icon: FaTags, path: '/dashboard/categories' },
  { id: 'menu', label: 'Menu', icon: FaList, path: '/dashboard/menu' },
  { id: 'auditlog', label: 'Audit Log', icon: FaScroll, path: '/dashboard/auditlog' },
]

const bottomMenuItems = [
  { id: 'settings', label: 'Settings', icon: FaCog, path: '/dashboard/settings' },
]

export default function Dashboard() {
  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const getActiveTab = () => {
    const path = location.pathname
    if (path.includes('/users')) return 'users'
    if (path.includes('/restaurants')) return 'restaurants'
    if (path.includes('/categories')) return 'categories'
    if (path.includes('/menu')) return 'menu'
    if (path.includes('/auditlog')) return 'auditlog'
    if (path.includes('/settings')) return 'settings'
    return 'users'
  }

  const activeTab = getActiveTab()

  const handleSignOut = () => {
    dispatch(signOut())
    navigate('/sign-in')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-1/5 min-w-[260px] bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#8fa31e]">EatWisely</span>
          </Link>
          <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
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

      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
