import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { signOut } from '../redux/user/userSlice'
import { logoutUser } from '../services/userApi'
import { getDefaultRouteByRole } from '../utils/auth'
import { Navbar, TextInput, Button, Dropdown, Avatar } from 'flowbite-react'
import { HiSearch, HiLocationMarker, HiUser, HiCog, HiLogout, HiViewGrid } from 'react-icons/hi'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentUser, userRole } = useSelector((state) => state.user)
  
  const [restaurantSearch, setRestaurantSearch] = useState('')
  const [locationSearch, setLocationSearch] = useState('')

  const hideHeaderPaths = ['/sign-in', '/sign-up', '/user-dashboard', '/superadmin', '/admin', '/manager']
  const shouldHideHeader = hideHeaderPaths.some(path => location.pathname.startsWith(path))

  const handleSignOut = async () => {
    try {
      await logoutUser()
      dispatch(signOut())
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Search:', { restaurant: restaurantSearch, location: locationSearch })
  }

  if (shouldHideHeader) return null

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex-shrink-0">
            <span className="text-3xl font-black">
              <span className="text-red-600">Eat</span>
              <span className="text-[#8fa31e]">Wisely</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl gap-2">
            <div className="relative flex-1">
              <TextInput
                type="text"
                placeholder="Search by restaurant..."
                value={restaurantSearch}
                onChange={(e) => setRestaurantSearch(e.target.value)}
                icon={HiSearch}
                className="w-full"
              />
            </div>
            <div className="relative flex-1">
              <TextInput
                type="text"
                placeholder="Search by location..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                icon={HiLocationMarker}
                className="w-full"
              />
            </div>
            <Button type="submit" className="bg-[#8fa31e] hover:bg-[#7a8c1a]">
              Search
            </Button>
          </form>

          <nav className="flex items-center gap-4">
            <Link to="/" className="hidden lg:block text-gray-600 hover:text-[#8fa31e] font-medium">
              Home
            </Link>
            <Link to="/restaurants" className="hidden lg:block text-gray-600 hover:text-[#8fa31e] font-medium">
              Restaurants
            </Link>
            <Link to="/categories" className="hidden lg:block text-gray-600 hover:text-[#8fa31e] font-medium">
              Categories
            </Link>
            <Link to="/menu" className="hidden lg:block text-gray-600 hover:text-[#8fa31e] font-medium">
              Food Menu
            </Link>

            {currentUser ? (
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar
                    img={currentUser.profilePicture || 'https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740&q=80'}
                    rounded
                    size="sm"
                    className="cursor-pointer border-2 border-[#8fa31e]"
                  />
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm font-semibold">{currentUser.userName}</span>
                  <span className="block text-sm text-gray-500 truncate">{currentUser.email}</span>
                </Dropdown.Header>
                <Dropdown.Item icon={HiUser}>
                  <Link to="/profile" className="w-full">Profile</Link>
                </Dropdown.Item>
                <Dropdown.Item icon={HiViewGrid}>
                  <Link to={getDefaultRouteByRole(userRole)} className="w-full">Dashboard</Link>
                </Dropdown.Item>
                <Dropdown.Item icon={HiCog}>
                  <Link to="/settings" className="w-full">Settings</Link>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item icon={HiLogout} onClick={handleSignOut}>
                  Sign Out
                </Dropdown.Item>
              </Dropdown>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/sign-in">
                  <Button color="gray" size="sm" className="text-[#8fa31e] border-[#8fa31e] hover:bg-[#f1f8eb]">
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button size="sm" className="bg-[#8fa31e] hover:bg-[#7a8c1a]">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>

        <form onSubmit={handleSearch} className="md:hidden mt-3 flex gap-2">
          <TextInput
            type="text"
            placeholder="Search restaurant..."
            value={restaurantSearch}
            onChange={(e) => setRestaurantSearch(e.target.value)}
            icon={HiSearch}
            className="flex-1"
          />
          <TextInput
            type="text"
            placeholder="Location..."
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            icon={HiLocationMarker}
            className="flex-1"
          />
        </form>
      </div>
    </header>
  )
}
