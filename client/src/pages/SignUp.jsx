import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  signInStart,
  signInSuccess,
  signInFailure,
  clearError,
} from "../redux/user/userSlice"
import { useToast } from "../components/Toast"
import { signup as apiSignup } from "../services/api"
import OAuth from "../components/OAuth"
import wavepattern from "../assets/wavepattern.png"
import logo from "../assets/eatwisely.ico"

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

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, toast, dispatch])

  const handleChange = (e) => {
    if (error) dispatch(clearError())
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.userName || !formData.email || !formData.password) {
      dispatch(signInFailure("Please fill in all fields"))
      return
    }

    if (formData.password.length < 8) {
      dispatch(signInFailure("Password must be at least 8 characters"))
      return
    }

    try {
      dispatch(signInStart())
      
      await apiSignup(formData)
      toast.success("Account created! Please sign in.")
      navigate("/sign-in")
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const inputType = showPassword ? "text" : "password"

  return (
    <main className="min-h-screen flex">
      <div className="hidden lg:flex flex-col w-[45%] bg-[#8fa31e] relative overflow-hidden p-12 justify-center items-start">
          <img
            src={wavepattern}
            alt="pattern"
            className="absolute top-0 left-0 w-full opacity-30 pointer-events-none object-cover"
          />

          <div className="relative z-10">
            <h1 className="text-7xl font-black text-white leading-tight uppercase tracking-normal">
              Your Menu <br /> Made <br /> Smarter
            </h1>
            <div className="mt-8 w-full">
              <svg
                viewBox="0 0 120 40"
                fill="none"
                className="w-full h-auto"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M10 10C30 35 90 35 110 10"
                  stroke="#ff0000"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M5 12L15 8"
                  stroke="#ff0000"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M115 12L105 8"
                  stroke="#ff0000"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

      <div className="flex-1 bg-[#f1f8eb] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="py-8 text-center pb-0">
            <div className="flex items-center justify-center gap-1 mb-6">
              <Link to="/">
                <img src={logo} width="200px" height="200px" alt="logo" />
              </Link>
            </div>
            <div className="bg-[#8fa31e] text-white py-3 rounded-[2px] shadow-md">
              <h2 className="text-xl font-semibold">Create Account</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
            <div className="space-y-1 mt-4">
              <label className="text-md font-normal text-gray-500">Enter UserName</label>
              <input
                type="text"
                placeholder=""
                id="userName"
                className="w-full border-gray-200 p-3 !rounded-[5px] bg-white focus:!ring-[#8fa31e] focus:!border-[#8fa31e]"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-md font-normal text-gray-500">Enter Email</label>
              <input
                type="email"
                placeholder=""
                id="email"
                className="w-full border-gray-200 p-3 !rounded-[5px] bg-white focus:!ring-[#8fa31e] focus:!border-[#8fa31e]"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1 relative">
              <label className="text-md font-normal text-gray-500">Enter Password</label>
              <div className="relative">
                <input
                  type={inputType}
                  placeholder=""
                  id="password"
                  className="w-full border-gray-200 p-3 !rounded-[5px] bg-white pr-12 focus:!ring-[#8fa31e] focus:!border-[#8fa31e]"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center top-6 !text-[#8fa31e]"
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

            <button
              disabled={loading}
              className="p-2 rounded-[5px] !bg-[#8fa31e] hover:!bg-[#7a8c1a] text-white !rounded-[4px] border-none"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <OAuth />
          </form>

            <div className="text-center pt-4">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link to="/sign-in" className="text-[#8fa31e] font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          <div className="pb-6 mt-10 text-center">
            <p className="text-[10px] text-gray-400">© 2025 EatWisely</p>
          </div>
        </div>
      </div>
    </main>
  )
}
