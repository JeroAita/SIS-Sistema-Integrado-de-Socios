import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa marcada
    const hasSession = localStorage.getItem('hasSession');
    
    console.log('🔍 AuthContext init - hasSession:', hasSession);
    
    if (hasSession === 'true') {
      // Solo verificar auth si hay una sesión marcada como activa
      console.log('✅ Sesión activa, verificando auth...');
      checkAuth();
    } else {
      console.log('❌ No hay sesión activa, saltando checkAuth');
      setUser(null);
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    console.log('🔐 Verificando autenticación...');
    try {
      const response = await api.get('/auth/profile/');
      console.log('✅ Auth verificada, usuario:', response.data.username);
      setUser(response.data);
      // Marcar que hay sesión activa
      localStorage.setItem('hasSession', 'true');
    } catch (error) {
      console.log('❌ Auth falló:', error.response?.status);
      setUser(null);
      // No hay sesión válida
      localStorage.removeItem('hasSession');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      console.log('🔑 Intentando login...');
      const response = await api.post('/auth/login/', { username, password });
      console.log('✅ Login exitoso');
      
      setUser(response.data.user);
      // Marcar que hay sesión activa
      localStorage.setItem('hasSession', 'true');
      
      return { success: true };
    } catch (error) {
      console.log('❌ Login falló:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error de login' 
      };
    }
  };

  const logout = async () => {
    console.log('🚪 Iniciando logout...');
    
    // PRIMERO: Eliminar la marca de sesión
    localStorage.removeItem('hasSession');
    console.log('🗑️ Marca de sesión eliminada');
    
    // Limpiar el estado local
    setUser(null);
    
    try {
      // Intentar hacer logout en el backend
      console.log('📡 Llamando a /auth/logout/');
      await api.post('/auth/logout/');
      console.log('✅ Logout exitoso en backend');
    } catch (error) {
      console.error('❌ Error en logout backend:', error);
      // Continuar con el logout incluso si falla el backend
    }
    
    // Forzar recarga completa de la página
    console.log('🔄 Recargando página...');
    setTimeout(() => {
      window.location.replace('/');
    }, 150);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
