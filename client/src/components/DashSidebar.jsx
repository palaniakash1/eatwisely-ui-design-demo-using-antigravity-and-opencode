import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { HiHome, HiUser, HiCollection, HiMenuAlt2, HiStar, HiCog, HiLogout, HiUserCircle, HiDocumentText } from 'react-icons/hi'
import { signOutSuccess } from '../redux/user/userSlice'
import { logoutUser } from '../services/userApi'

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: HiHome },
  { name: 'Profile', path: '/dashboard/profile', icon: HiUserCircle },
  { name: 'Users', path: '/dashboard/users', icon: HiUser },
  { name: 'Restaurants', path: '/dashboard/restaurants', icon: HiMenuAlt2 },
  { name: 'Categories', path: '/dashboard/categories', icon: HiCollection },
  { name: 'Menu', path: '/dashboard/menu', icon: HiMenuAlt2 },
  { name: 'Audit Log', path: '/dashboard/audit-log', icon: HiDocumentText },
]

export default function DashSidebar({ isOpen, onClose }) {
  const dispatch = useDispatch()

  const handleLogout = async () => {
    await logoutUser()
    dispatch(signOutSuccess())
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#8fa31e]">EatWisely</h2>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 hover:bg-[#f1f8eb] ${
                  isActive ? 'bg-[#f1f8eb] text-[#8fa31e] border-r-4 border-[#8fa31e]' : 'text-gray-600'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-[#f1f8eb] w-full"
          >
            <HiLogout className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
