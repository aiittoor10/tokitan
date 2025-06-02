import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario || usuario.rol !== 'ADMIN') {
    return <Navigate to="/usuario-dashboard" />;
  }

  return children;
};

export default AdminRoute;
