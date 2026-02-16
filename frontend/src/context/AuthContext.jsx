import React, { createContext, useContext, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data);
    return data;
  };

  const register = async (email, fullName, password, role, companyName, phone) => {
    const data = await authService.register(email, fullName, password, role, companyName, phone);
    setUser(data);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isRecruiter = () => user?.role === 'RECRUITER';
  const isSeeker = () => user?.role === 'JOB_SEEKER';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isRecruiter, isSeeker }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
