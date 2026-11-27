import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config';
import { showError } from '../helpers';
import styles from '../styles';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  // create a new account (the backend checks empty fields)
  function register() {
    axios.post(BASE_URL + '/register', {
      name: email.split('@')[0],
      email: email.trim(),
      password
    })
      .then((res) => Alert.alert('Done', res.data.message + '. Now press Login.'))
      .catch(showError);
  }

  return (
    <View style={styles.center}>
      <View>
        <Text>Expense Tracker</Text>
        <Text>Login to continue</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <Button title="Login" onPress={() => login(email.trim(), password)} />
        <Button title="Register" onPress={register} />
      </View>
    </View>
  );
}
