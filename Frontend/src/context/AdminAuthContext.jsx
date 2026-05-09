import React, { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loginAdmin = async (username, password) => {
    setLoading(true);
    setError('');
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    if (username === 'admin' && password === 'admin123') {
      setAdminUser({
        id: 'A001',
        name: 'Chief Controller of Exams',
        role: 'SuperAdmin'
      });
      setLoading(false);
      return true;
    } else {
      setError('Invalid Admin Credentials. Try admin / admin123.');
      setLoading(false);
      return false;
    }
  };

  const logoutAdmin = () => {
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, loginAdmin, logoutAdmin, error, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
