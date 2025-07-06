import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/auth.tsx';

// Páginas
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import TarefasList from './pages/TarefasList.tsx';
import PasswordChange from './pages/PasswordChange.tsx';
import PasswordRecover from './pages/PasswordRecover.tsx';

// Componente para rotas privadas
const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { signed, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return signed ? element : <Navigate to="/login" />;
};

// Componente para rotas de admin
const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { signed, loading, isAdmin } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return signed && isAdmin() ? element : <Navigate to="/" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/recover" element={<PasswordRecover />} />
          <Route path="/password" element={<PrivateRoute element={<PasswordChange />} />} />
          <Route path="/register" element={<AdminRoute element={<Register />} />} />
          <Route path="/" element={<PrivateRoute element={<TarefasList />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
