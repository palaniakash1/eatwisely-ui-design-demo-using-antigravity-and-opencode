import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
  const { currentUser } = useSelector((state) => state.user)
  
  if (!currentUser) {
    return <Navigate to="/sign-in" />
  }
  
  return children
}
