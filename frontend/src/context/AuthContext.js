import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import { showError } from '../helpers';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true); // true while we check the saved login
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  function login(email, password) {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    axios.post(BASE_URL + '/login', { email, password })
      .then((res) => {
        setUserToken(res.data.token);
        setUserInfo(res.data.user);
        // save in phone storage so the user stays logged in
        AsyncStorage.setItem('userToken', res.data.token);
        AsyncStorage.setItem('userInfo', JSON.stringify(res.data.user));
      })
      .catch(showError);
  }

  function logout() {
    setUserToken(null);
    setUserInfo(null);
    AsyncStorage.removeItem('userToken');
    AsyncStorage.removeItem('userInfo');
  }

  // when the app opens, check if the user was already logged in
  useEffect(() => {
    async function checkSavedLogin() {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const user = await AsyncStorage.getItem('userInfo');
        if (token && user) {
          setUserToken(token);
          setUserInfo(JSON.parse(user));
        }
      } catch (err) {
        console.log('storage error:', err);
      }
      setIsLoading(false);
    }
    checkSavedLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, userToken, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
}
