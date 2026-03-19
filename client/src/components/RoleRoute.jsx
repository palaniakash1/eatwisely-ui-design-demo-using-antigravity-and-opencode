import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isRoleAccessible, getDefaultRouteByRole } from '../utils/auth';

export default function RoleRoute({ children, allowedRoles }) {
  const { currentUser, userRole } = useSelector((state) => state.user);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (!isRoleAccessible(userRole, allowedRoles)) {
    const redirectPath = getDefaultRouteByRole(userRole);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}