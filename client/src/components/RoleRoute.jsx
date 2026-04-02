/**
 * =============================================================================
 * ROLE ROUTE - Route Guard for Role-Based Access Control
 * =============================================================================
 * 
 * This component extends PrivateRoute with role-based access control.
 * 
 * Usage:
 * 
 * <RoleRoute allowedRoles={['admin', 'superAdmin']}>
 *   <AdminDashboard />
 * </RoleRoute>
 * 
 * How it works:
 * 1. Check if user is authenticated
 * 2. Check if user's role is in the allowedRoles array
 * 3. If authorized, render children
 * 4. If not authorized, redirect to user's default dashboard
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isRoleAccessible, getDefaultRouteByRole } from '../utils/auth'

export default function RoleRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, isInitialized, role } = useAuth()
  const location = useLocation()

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8fa31e]"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  if (!isRoleAccessible(role, allowedRoles)) {
    const redirectPath = getDefaultRouteByRole(role)
    return <Navigate to={redirectPath} replace />
  }

  return children
}
