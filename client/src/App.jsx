import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
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
import PrivateRoute from './components/PrivateRoute'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  const { currentUser } = useSelector((state) => state.user)
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

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
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard/users" replace />} />
            <Route path="users" element={<DashUsers />} />
            <Route path="restaurants" element={<DashRestaurants />} />
            <Route path="categories" element={<DashCategories />} />
            <Route path="menu" element={<DashMenu />} />
            <Route path="auditlog" element={<DashAuditLog />} />
            <Route path="settings" element={<DashSettings />} />
          </Route>
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  )
}
