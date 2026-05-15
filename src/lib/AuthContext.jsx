import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const navigateToLogin = useCallback(() => {}, []);

  const checkUserAuth = useCallback(async () => {
    setUser(null);
    return null;
  }, []);

  const checkAppState = useCallback(async () => null, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: false,
    isLoadingAuth: false,
    isLoadingPublicSettings: false,
    authError: null,
    appPublicSettings: null,
    authChecked: true,
    logout,
    navigateToLogin,
    checkUserAuth,
    checkAppState,
  }), [user, logout, navigateToLogin, checkUserAuth, checkAppState]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
