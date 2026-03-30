import React, { createContext, useContext, useState } from 'react';
import { CURRENT_USER_REG_NO, studentProfile } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (regNo, password) => {
    setLoading(true);
    setError('');
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    // Validate password first
    if (password !== '123') {
      setError('Invalid password. Please try again.');
      setLoading(false);
      return false;
    }
    
    // Accept valid mock registration numbers
    if (['101', '102', '103', '104', '105', CURRENT_USER_REG_NO].includes(regNo)) {
        setUser({
          ...studentProfile,
          regNo: regNo,
          name: regNo === CURRENT_USER_REG_NO ? studentProfile.name : `Demo Student ${regNo}`
        });
        setLoading(false);
        return true;
    } else {
        setError('Invalid Registration Number. Try 101 with password 123.');
        setLoading(false);
        return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
