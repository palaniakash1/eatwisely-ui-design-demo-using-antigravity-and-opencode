import { Link } from 'react-router-dom';
import { HiHome, HiCog, HiMail } from 'react-icons/hi';
import { useSystemMode } from '../context/SystemModeContext';
import { useAuth } from '../context/AuthContext';

export default function MaintenanceMode() {
  const { setMaintenanceMode } = useSystemMode();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superAdmin';

  const handleDisableMaintenance = () => {
    setMaintenanceMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAxMCAwIDAgTSAxMCA2MCBMIDAgNjAgMCA2MCBNIDYwIDAgTCA1MCAxMCA1MCAwIEwgNjAgMA0KICA1MCA2MCBMIDYwIDUwIDYwIDYwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            
            <div className="relative z-10">
              <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center mb-6 shadow-xl animate-pulse">
                <HiCog className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
                Under Maintenance
              </h1>
              <p className="text-white/90 text-lg">
                We're currently performing scheduled maintenance.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-12 text-center">
            <div className="w-24 h-24 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-6 border-2 border-amber-200">
              <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              We'll Be Back Soon!
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Our team is working hard to improve your experience. 
              We expect to be back online shortly. Thank you for your patience!
            </p>

            <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Estimated Time</p>
                    <p className="font-semibold text-white">A few minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiMail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Need Help?</p>
                    <p className="font-semibold text-white">support@eatwisely.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isSuperAdmin && (
                <button
                  onClick={handleDisableMaintenance}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl transition-all font-semibold shadow-lg shadow-emerald-500/25"
                >
                  <HiCog className="w-5 h-5" />
                  Disable Maintenance Mode
                </button>
              )}
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition-all font-semibold shadow-lg shadow-amber-500/25"
              >
                <HiHome className="w-5 h-5" />
                Return to Homepage
              </Link>
            </div>
          </div>

          <div className="px-8 py-4 bg-black/20 border-t border-white/5">
            <p className="text-center text-sm text-gray-500">
              EatWisely Platform • Maintenance Mode
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
