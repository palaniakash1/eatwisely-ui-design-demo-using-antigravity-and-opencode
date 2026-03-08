import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, TextInput, Button, Label, FileInput } from 'flowbite-react'
import { updateUserSuccess, updateUserStart, updateUserFailure } from '../redux/user/userSlice'
import ImageCircleLoader from './ImageCircleLoader'

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
  })
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        dispatch(updateUserFailure(data.message))
      } else {
        dispatch(updateUserSuccess(data))
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
    setLoading(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <Card>
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4">
            <ImageCircleLoader
              src={avatar ? URL.createObjectURL(avatar) : currentUser?.profilePicture}
              alt="Profile"
              size={100}
            />
          </div>
          <Label htmlFor="avatar" className="cursor-pointer">
            <span className="text-[#8fa31e] hover:underline">Change Photo</span>
            <FileInput
              id="avatar"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </Label>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="username" value="Username" />
            <TextInput
              id="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="phone" value="Phone" />
            <TextInput
              id="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="address" value="Address" />
            <TextInput
              id="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <Button
            type="submit"
            className="bg-[#8fa31e]"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
