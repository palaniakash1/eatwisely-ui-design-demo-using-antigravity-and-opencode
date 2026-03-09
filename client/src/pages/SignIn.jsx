import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  signInStart,
  signInSuccess,
  signInFailure,
  clearError,
} from "../redux/user/userSlice"
import { useDispatch, useSelector } from "react-redux"
import OAuth from "../components/OAuth"
import { Alert } from "flowbite-react"
import usersData from "../data/users.json"

const EyeIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.46-1.32" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
)

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [localError, setLocalError] = useState(null)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    if (error) dispatch(clearError())
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
    if (e.target.id === "password") {
      setPassword(e.target.value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      dispatch(signInFailure("Please fill in all fields"))
      return
    }
    try {
      dispatch(signInStart())
      
      const storedUsers = localStorage.getItem('users')
      const allUsers = storedUsers ? JSON.parse(storedUsers) : usersData
      
      const user = allUsers.find(u => u.email === formData.email && u.password === formData.password)
      
      if (!user) {
        dispatch(signInFailure("Invalid email or password"))
        return
      }

      const { password, ...userWithoutPassword } = user
      dispatch(signInSuccess(userWithoutPassword))
      navigate("/")
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const inputType = showPassword ? "text" : "password"

  return (
    <>
      <main className="min-h-screen flex">
        <div className="hidden lg:flex flex-col w-[45%] bg-[#8fa31e] relative overflow-hidden p-12 justify-center items-start">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800')] bg-cover bg-center" />

          <div className="relative z-10">
            <h1 className="text-7xl font-black text-white leading-tight uppercase tracking-normal">
              CLARITY IN <br /> EVERY <br /> INGREDIENT
            </h1>
          </div>
        </div>

        <div className="flex-1 bg-[#f1f8eb] flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
            <div className="py-8 text-center pb-0">
              <div className="flex items-center justify-center gap-1 mb-6">
                <Link to="/">
                  <h1 className="text-3xl font-bold text-[#8fa31e]">EatWisely</h1>
                </Link>
              </div>
              <div className="bg-[#8fa31e] text-white py-3 rounded-[2px] shadow-md">
                <h2 className="text-xl font-semibold">Welcome Back</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
              <div className="space-y-1 mt-4">
                <label className="text-md font-normal text-gray-500 mt-10">
                  Enter Email
                </label>
                <input
                  type="email"
                  placeholder=""
                  id="email"
                  className="w-full border-gray-200 p-3 rounded-md bg-white focus:ring-[#8fa31e] focus:border-[#8fa31e]"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1 relative">
                <label className="text-md font-normal text-gray-500 mt-10">
                  Enter Password
                </label>
                <div className="relative">
                  <input
                    type={inputType}
                    placeholder=""
                    id="password"
                    className="w-full border-gray-200 p-3 rounded-md bg-white pr-12 focus:ring-[#8fa31e] focus:border-[#8fa31e]"
                    onChange={handleChange}
                    value={password}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8fa31e]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {(localError || error) && (
                <Alert
                  color="failure"
                  onDismiss={() => {
                    setLocalError(null)
                    dispatch(clearError())
                  }}
                  className="m-4"
                >
                  <span className="font-medium">Oops!</span>{" "}
                  {localError || error}
                </Alert>
              )}
              
              <button
                disabled={loading}
                className="p-2 rounded-md bg-[#8fa31e] hover:bg-[#7a8c1a] text-white border-none"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <OAuth />
            </form>

            <div className="text-center pt-4">
              <p className="text-gray-600 text-sm">
                Create new account?{" "}
                <Link
                  to="/sign-up"
                  className="text-red-600 font-bold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
            <div className="pb-6 mt-10 text-center">
              <p className="text-[10px] text-gray-400">© 2025 EatWisely</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
