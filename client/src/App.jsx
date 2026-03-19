import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Restaurants from './pages/Restaurants'
import SingleRestaurant from './pages/SingleRestaurant'
import DashUsers from './pages/DashUsers'
import DashRestaurants from './pages/DashRestaurants'
import DashCategories from './pages/DashCategories'
import DashMenu from './pages/DashMenu'
import DashAuditLog from './pages/DashAuditLog'
import DashSettings from './pages/DashSettings'
import DashProfile from './components/DashProfile'
import PrivateRoute from './components/PrivateRoute'
import RoleRoute from './components/RoleRoute'
import Header from './components/Header'
import Footer from './components/Footer'
import SuperAdminLayout from './pages/superadmin/SuperAdminLayout'
import SuperAdminOverview from './pages/superadmin/Overview'
import AdminLayout from './pages/admin/AdminLayout'
import AdminOverview from './pages/admin/Overview'
import ManagerLayout from './pages/manager/ManagerLayout'
import ManagerOverview from './pages/manager/Overview'
import UserDashboardLayout from './pages/user/UserDashboardLayout'
import UserOverview from './pages/user/Overview'
import UserReviews from './pages/user/Reviews'
import UserProfile from './pages/user/Profile'
import DashReviews from './pages/superadmin/Reviews'
import AdminRestaurant from './pages/admin/Restaurant'
import AdminStoreManagers from './pages/admin/StoreManagers'
import AdminReviews from './pages/admin/Reviews'
import ManagerCategories from './pages/manager/Categories'
import ManagerReviews from './pages/manager/Reviews'
import { ROLES } from './utils/auth'
import { signInSuccess } from './redux/user/userSlice'

export default function App() {
  const { currentUser, userRole } = useSelector((state) => state.user)
  const location = useLocation()
  const dispatch = useDispatch()
  const [sessionRestored, setSessionRestored] = useState(false)

  useEffect(() => {
    const restoreSession = async () => {
      if (currentUser) {
        setSessionRestored(true)
        return
      }
      
      try {
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
        })
        if (response.ok) {
          const data = await response.json()
          
          if (data.success && data.data) {
            const user = data.data
            dispatch(signInSuccess({
              user: user,
              role: user.role || 'user',
              token: null
            }))
          }
        }
      } catch (error) {
        console.log('Session restoration failed:', error)
      }
      setSessionRestored(true)
    }
    restoreSession()
  }, [dispatch, currentUser])

  const isDashboard = location.pathname.startsWith('/user-dashboard') || 
                      location.pathname.startsWith('/superadmin') ||
                      location.pathname.startsWith('/admin') ||
                      location.pathname.startsWith('/manager')

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboard && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:slug" element={<SingleRestaurant />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about" element={<About />} />

          <Route
            path="/user-dashboard"
            element={
              <RoleRoute allowedRoles={[ROLES.USER]}>
                <UserDashboardLayout />
              </RoleRoute>
            }
          >
            <Route index element={<UserOverview />} />
            <Route path="reviews" element={<UserReviews />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          <Route
            path="/superadmin"
            element={
              <RoleRoute allowedRoles={[ROLES.SUPERADMIN]}>
                <SuperAdminLayout />
              </RoleRoute>
            }
          >
            <Route index element={<SuperAdminOverview />} />
            <Route path="overview" element={<SuperAdminOverview />} />
            <Route path="users" element={<DashUsers />} />
            <Route path="restaurants" element={<DashRestaurants />} />
            <Route path="categories" element={<DashCategories />} />
            <Route path="menu" element={<DashMenu />} />
            <Route path="reviews" element={<DashReviews />} />
            <Route path="auditlog" element={<DashAuditLog />} />
            <Route path="settings" element={<DashSettings />} />
            <Route path="profile" element={<DashProfile />} />
          </Route>

          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN]}>
                <AdminLayout />
              </RoleRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="restaurant" element={<AdminRestaurant />} />
            <Route path="users" element={<AdminStoreManagers />} />
            <Route path="restaurants" element={<DashRestaurants />} />
            <Route path="categories" element={<DashCategories />} />
            <Route path="menu" element={<DashMenu />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="auditlog" element={<DashAuditLog />} />
            <Route path="settings" element={<DashSettings />} />
            <Route path="profile" element={<DashProfile />} />
          </Route>

          <Route
            path="/manager"
            element={
              <RoleRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.STORE_MANAGER]}>
                <ManagerLayout />
              </RoleRoute>
            }
          >
            <Route index element={<ManagerOverview />} />
            <Route path="overview" element={<ManagerOverview />} />
            <Route path="categories" element={<ManagerCategories />} />
            <Route path="menu" element={<DashMenu />} />
            <Route path="reviews" element={<ManagerReviews />} />
            <Route path="settings" element={<DashSettings />} />
            <Route path="profile" element={<DashProfile />} />
          </Route>

          <Route  
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  )
}
