import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [email, setEmail] = useState(() => localStorage.getItem('email'));

  const loginUser = (token, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    setToken(token);
    setEmail(email);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setToken(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, email, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
