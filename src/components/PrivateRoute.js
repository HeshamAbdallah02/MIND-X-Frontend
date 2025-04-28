//frontend/src/components/PrivateRoute.js
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  const location = useLocation();
  const adminPath = process.env.REACT_APP_ADMIN_PATH;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return admin ? children : <Navigate to={`/${adminPath}/access`} state={{ from: location }} replace />;
};

export default PrivateRoute;