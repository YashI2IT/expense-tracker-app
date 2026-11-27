import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../config';
import { showError } from '../helpers';
import styles from '../styles';

export default function HistoryScreen({ goBack }) {
  const [history, setHistory] = useState([]);

  // load the history when the screen opens
  useEffect(() => {
    axios.get(BASE_URL + '/history')
      .then((res) => setHistory(res.data))
      .catch(showError);
  }, []);

  return (
    <View style={styles.screen}>
      <View>
        <Button title="Back" onPress={goBack} />
        <Text>Edit History</Text>
      </View>

      <ScrollView contentContainerStyle={styles.padding}>
        {history.length === 0 ? (
          <Text>No edits yet</Text>
        ) : (
          history.map((item) => (
            <View key={item.id}>
              <Text>{item.action}</Text>
              <Text>{item.details}</Text>
              <Text>{item.time}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
