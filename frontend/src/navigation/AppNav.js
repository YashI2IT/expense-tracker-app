import React, { useContext, useState, useEffect } from 'react';
import { View, ActivityIndicator, BackHandler } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import styles from '../styles';

export default function AppNav() {
  const { isLoading, userToken } = useContext(AuthContext);
  const [screen, setScreen] = useState('home'); // 'home' or 'history'

  // phone back button goes from history to home instead of closing the app
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'history') {
        setScreen('home');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [screen]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // not logged in -> login screen
  if (userToken === null) {
    return <LoginScreen />;
  }
  if (screen === 'history') {
    return <HistoryScreen goBack={() => setScreen('home')} />;
  }
  return <HomeScreen openHistory={() => setScreen('history')} />;
}
