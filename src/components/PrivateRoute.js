import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { admin } = useAuth();
  
  return admin ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute;