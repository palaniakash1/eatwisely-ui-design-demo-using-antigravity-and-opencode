/**
 * =============================================================================
 * PRIVATE ROUTE - Route Guard for Authenticated Users
 * =============================================================================
 * 
 * This component wraps protected routes and ensures:
 * 1. User is authenticated
 * 2. Session is still valid
 * 3. Redirects to sign-in if not authenticated
 * 
 * How it works:
 * 1. Check if user is authenticated from AuthContext
 * 2. If not initialized yet, show loading spinner
 * 3. If not authenticated, redirect to sign-in
 * 4. If authenticated, render the children (protected content)
 */

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading, isInitialized } = useAuth()

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8fa31e]"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />
  }
  
  return children
}
