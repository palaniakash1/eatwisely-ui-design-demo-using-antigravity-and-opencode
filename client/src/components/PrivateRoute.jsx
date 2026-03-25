import { useSelector, useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from '../services/axios'
import { signOut } from '../redux/user/userSlice'

export default function PrivateRoute({ children }) {
  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const validateSession = async () => {
      if (!currentUser) {
        setIsValidating(false)
        setIsValid(false)
        return
      }

      const isLoggingOut = sessionStorage.getItem('isLoggingOut')
      if (isLoggingOut === 'true') {
        setIsValidating(false)
        setIsValid(false)
        return
      }

      try {
        const response = await axios.get('/auth/session')
        if (response.data?.success) {
          setIsValid(true)
        } else {
          dispatch(signOut())
          setIsValid(false)
        }
      } catch (error) {
        dispatch(signOut())
        setIsValid(false)
      } finally {
        setIsValidating(false)
      }
    }

    validateSession()
  }, [currentUser, dispatch])

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8fa31e]"></div>
      </div>
    )
  }

  if (!isValid || !currentUser) {
    return <Navigate to="/sign-in" />
  }
  
  return children
}
