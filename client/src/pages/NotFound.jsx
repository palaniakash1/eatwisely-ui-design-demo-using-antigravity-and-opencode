import { Link } from 'react-router-dom';
import { HiHome, HiArrowLeft } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9e8] via-[#fafcf3] to-[#f4f7e8] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#6b7d18] via-[#8fa31e] to-[#a5b82e] px-8 py-12 text-center">
            <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center mb-6 shadow-xl">
              <span className="text-7xl font-bold text-white">404</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Page Not Found
            </h1>
            <p className="text-green-100 text-lg">
              Oops! The page you're looking for doesn't exist.
            </p>
          </div>

          <div className="p-8 sm:p-12 text-center">
            <div className="w-24 h-24 mx-auto bg-[#f7f9e8] rounded-full flex items-center justify-center mb-6 border-2 border-[#d4de8a]/40">
              <svg className="w-12 h-12 text-[#8fa31e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
              Lost Your Way?
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Don't worry, even the best explorers sometimes take a wrong turn. 
              Let's get you back on track!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#6b7d18] to-[#8fa31e] hover:from-[#4a5c10] hover:to-[#6b7d18] text-white rounded-xl transition-all font-semibold shadow-lg shadow-[#8fa31e]/25"
              >
                <HiHome className="w-5 h-5" />
                Go to Homepage
              </Link>
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-gray-200 hover:border-[#8fa31e] text-gray-700 rounded-xl transition-all font-semibold"
              >
                <HiArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100">
              <p className="text-sm text-gray-400 mb-4">Popular Pages</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/restaurants" className="px-4 py-2 bg-[#f7f9e8] hover:bg-[#eef4d3] text-[#6b7d18] rounded-lg text-sm font-medium transition-colors">
                  Browse Restaurants
                </Link>
                <Link to="/sign-in" className="px-4 py-2 bg-[#f7f9e8] hover:bg-[#eef4d3] text-[#6b7d18] rounded-lg text-sm font-medium transition-colors">
                  Sign In
                </Link>
                <Link to="/about" className="px-4 py-2 bg-[#f7f9e8] hover:bg-[#eef4d3] text-[#6b7d18] rounded-lg text-sm font-medium transition-colors">
                  About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
