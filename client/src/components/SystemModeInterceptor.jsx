import { useSystemMode } from '../context/SystemModeContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import MaintenanceMode from '../pages/MaintenanceMode';
import UnderDevelopment from '../pages/UnderDevelopment';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9e8] via-[#fafcf3] to-[#f4f7e8] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#8fa31e]/30 border-t-[#8fa31e] rounded-full animate-spin" />
        <p className="text-[#6b7d18] font-medium">Loading...</p>
      </div>
    </div>
  );
}

const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/signin', '/signup'];

export default function SystemModeInterceptor({ children }) {
  const { isMaintenanceMode, isUnderDevelopment } = useSystemMode();
  const { user, isInitialized } = useAuth();
  const location = useLocation();

  const isPublicPath = PUBLIC_PATHS.some(path => 
    location.pathname === path || location.pathname.startsWith(path + '/')
  );

  const userRole = user?.role;
  const isSuperAdmin = isInitialized && userRole === 'superAdmin';

  if (isPublicPath) {
    return children;
  }

  if (isMaintenanceMode && !isSuperAdmin) {
    return <MaintenanceMode />;
  }

  if (isUnderDevelopment && !isSuperAdmin) {
    return <UnderDevelopment />;
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return children;
}
