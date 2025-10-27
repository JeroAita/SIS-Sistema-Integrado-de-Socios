import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import SportsDashboard from "./components/layout/SportsDashboard";
import Login from "./components/auth/Login";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>
      Cargando...
    </div>;
  }
  
  return isAuthenticated ? children : <Login />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <SportsDashboard initialView="inicio" />
        </ProtectedRoute>
      } />
      <Route path="/socios" element={
        <ProtectedRoute>
          <SportsDashboard initialView="socios" />
        </ProtectedRoute>
      } />
      <Route path="/staff" element={
        <ProtectedRoute>
          <SportsDashboard initialView="staff" />
        </ProtectedRoute>
      } />
      <Route path="/actividades" element={
        <ProtectedRoute>
          <SportsDashboard initialView="actividades" />
        </ProtectedRoute>
      } />
      <Route path="/pagos" element={
        <ProtectedRoute>
          <SportsDashboard initialView="pagos" />
        </ProtectedRoute>
      } />
      <Route path="/configuracion" element={
        <ProtectedRoute>
          <SportsDashboard initialView="configuracion" />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
