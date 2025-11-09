import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
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
      <Route path="/actividades-socio" element={
        <ProtectedRoute>
          <SportsDashboard initialView="actividades-socio" />
        </ProtectedRoute>
      } />
      <Route path="/mis-actividades" element={
        <ProtectedRoute>
          <SportsDashboard initialView="misActividades" />
        </ProtectedRoute>
      } />
      <Route path="/compensaciones" element={
        <ProtectedRoute>
          <SportsDashboard initialView="compensaciones" />
        </ProtectedRoute>
      } />
      <Route path="/perfil" element={
        <ProtectedRoute>
          <SportsDashboard initialView="perfil" />
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
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
