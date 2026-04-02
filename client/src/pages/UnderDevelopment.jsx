import { Link } from 'react-router-dom';
import { HiHome, HiCode, HiMail } from 'react-icons/hi';
import { useSystemMode } from '../context/SystemModeContext';
import { useAuth } from '../context/AuthContext';

export default function UnderDevelopment() {
  const { setUnderDevelopment } = useSystemMode();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superAdmin';

  const handleDisableDevelopment = () => {
    setUnderDevelopment(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAyMCAwIEwgMCAyMCAwIDAgTSAyMCA0MCBMIDAgNDAgMCA0MCBNIDQwIDAgTCAzMCAxMCAzMCAwIEwgNDAgMA0KICAzMCA0MCBMIDQwIDMwIDQwIDQwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative z-10">
              <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                <div className="relative">
                  <HiCode className="w-16 h-16 text-white animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-900">!</span>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
                Coming Soon
              </h1>
              <p className="text-white/90 text-lg">
                This feature is currently under development.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-12 text-center">
            <div className="w-24 h-24 mx-auto bg-purple-50 rounded-full flex items-center justify-center mb-6 border-2 border-purple-200">
              <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Something Awesome is Brewing!
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Our talented developers are crafting something special for you. 
              This page is under active development and will be available soon!
            </p>

            <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-400">Development Status</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full w-3/4 animate-pulse" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phase</p>
                    <p className="font-semibold text-white text-sm">In Progress</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">ETA</p>
                    <p className="font-semibold text-white text-sm">Soon™</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HiMail className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Questions?</p>
                    <p className="font-semibold text-white text-sm">Contact Us</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isSuperAdmin && (
                <button
                  onClick={handleDisableDevelopment}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl transition-all font-semibold shadow-lg shadow-emerald-500/25"
                >
                  <HiCode className="w-5 h-5" />
                  Disable Development Mode
                </button>
              )}
              <Link
                to="/"
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all font-semibold shadow-lg shadow-purple-500/25"
              >
                <HiHome className="w-5 h-5" />
                Go to Homepage
              </Link>
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all font-semibold backdrop-blur"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Go Back
              </button>
            </div>
          </div>

          <div className="px-8 py-4 bg-black/20 border-t border-white/5">
            <p className="text-center text-sm text-gray-500">
              EatWisely Platform • Under Development
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
