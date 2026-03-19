import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Button, TextInput, Label, FileInput } from 'flowbite-react'
import { updateUserSuccess } from '../../redux/user/userSlice'

const EyeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.46-1.32" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
)

export default function UserProfile() {
  const { currentUser, loading } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    userName: currentUser?.userName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // API call to update user would go here
    console.log('Updating profile:', formData)
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    // API call to change password would go here
    console.log('Changing password')
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-4 mb-4">
              {currentUser?.profilePicture ? (
                <img
                  src={currentUser.profilePicture}
                  alt={currentUser.userName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#8fa31e] flex items-center justify-center text-white text-2xl font-semibold">
                  {currentUser?.userName?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <Label htmlFor="profilePicture" value="Change Photo" className="block mb-1" />
                <FileInput id="profilePicture" accept="image/*" className="max-w-xs" />
              </div>
            </div>

            <div>
              <Label htmlFor="userName" value="Username" />
              <TextInput
                id="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <Label htmlFor="email" value="Email" />
              <TextInput
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="phone" value="Phone Number" />
              <TextInput
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label htmlFor="address" value="Address" />
              <TextInput
                id="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
              />
            </div>

            <Button type="submit" className="bg-[#8fa31e] mt-2" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="currentPassword" value="Current Password" />
              <div className="relative">
                <TextInput
                  id="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOffIcon className="text-gray-400" /> : <EyeIcon className="text-gray-400" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword" value="New Password" />
              <TextInput
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" value="Confirm New Password" />
              <TextInput
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
              />
            </div>

            <Button type="submit" className="bg-[#8fa31e] mt-2">
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
