import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logout as performLogout } from '../utils/auth';
import Spinner from '../components/Spinner';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const[loading,setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = async () => {
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);
      setLoading(false);
    };
    checkAuth();
    
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    performLogout(navigate);
    setIsLoggedIn(false);
  };

  if(loading){
    <Spinner/>
    return <div>Loading ....</div>
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use authentication context.
 * @returns {object} - Authentication state and actions.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
