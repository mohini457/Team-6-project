import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        // Decode token or fetch user details from an API if needed.
        // For simplicity, we just save the token and rely on localStorage
        const decoded = jwtDecode(token);
        setUser({ email: decoded.sub }); // Needs role decoding if included in JWT, or fetching user profile
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:8080/auth/login', { email, password });
    const { token, role, name, id } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ role, name, id, email }));
    setToken(token);
    setUser({ role, name, id, email });
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return role;
  };

  const signup = async (userData) => {
    const res = await axios.post('http://localhost:8080/auth/signup', userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
