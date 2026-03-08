import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
} from '../redux/user/userSlice'
import { TextInput, Button, Card } from 'flowbite-react'

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (Object.keys(formData).length === 0) {
      return
    }
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess())
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout')
      dispatch(signOut())
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Profile</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#8fa31e]"
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </form>

      {error && (
        <Card className="mt-4 bg-red-50">
          <p className="text-red-500">{error}</p>
        </Card>
      )}

      {updateSuccess && (
        <Card className="mt-4 bg-green-50">
          <p className="text-green-500">Profile updated successfully!</p>
        </Card>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={handleDeleteAccount}
          className="text-red-500 hover:underline"
        >
          Delete Account
        </button>
        <button
          onClick={handleSignOut}
          className="text-red-500 hover:underline"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
