// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');
        if (userToken && userData) {
          setToken(userToken);
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error('Restoring token failed', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    login: async (email, password) => {
      try {
        const response = await apiClient.post('/auth/login', { email, password });
        const { token: userToken, user: userData } = response.data;
        
        await AsyncStorage.setItem('userToken', userToken);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        
        setToken(userToken);
        setUser(userData);
        return { success: true };
      } catch (error) {
        const message = error.response?.data?.msg || 'An unknown error occurred.';
        return { success: false, message };
      }
    },
    logout: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
        setToken(null);
        setUser(null);
      } catch (e) {
        console.error('Logout failed', e);
      }
    },
    user,
    token,
    isLoading,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};