import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, ScrollView, Button, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config';
import { showError } from '../helpers';
import styles from '../styles';

export default function HomeScreen({ openHistory }) {
  const { logout, userInfo } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editId, setEditId] = useState(null); // null means we are adding a new expense
  const scrollRef = useRef(null);

  // get all expenses from the backend
  function getItems() {
    axios.get(BASE_URL + '/items')
      .then((res) => setItems(res.data))
      .catch(showError);
  }

  // run once when the screen opens
  useEffect(() => {
    getItems();
  }, []);

  function clearForm() {
    setName('');
    setPrice('');
    setEditId(null);
  }

  // add a new expense, or update one if we are editing
  function save() {
    if (name.trim() === '' || isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Enter item name and a price greater than 0');
      return;
    }
    const data = { name: name.trim(), price };
    const request = editId === null
      ? axios.post(BASE_URL + '/items', data)
      : axios.put(BASE_URL + '/items/' + editId, data);

    request
      .then(() => {
        clearForm();
        getItems();
      })
      .catch(showError);
  }

  function deleteItem(item) {
    Alert.alert('Delete', 'Delete "' + item.name + '"?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: () => {
          axios.delete(BASE_URL + '/items/' + item.id)
            .then(() => {
              if (editId === item.id) {
                clearForm();
              }
              getItems();
            })
            .catch(showError);
        }
      }
    ]);
  }

  // put the item in the form and scroll up to it
  function editItem(item) {
    setEditId(item.id);
    setName(item.name);
    setPrice(String(item.price));
    scrollRef.current.scrollTo({ y: 0, animated: true });
  }

  // total of all expenses
  let total = 0;
  items.forEach((item) => {
    total = total + item.price;
  });
  total = Math.round(total * 100) / 100;

  return (
    <View style={styles.screen}>
      <View>
        <View>
          <Text>Hello, {userInfo ? userInfo.name : ''}</Text>
        </View>
        <Button title="Logout" onPress={logout} />
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.padding} keyboardShouldPersistTaps="handled">
        <Text>Total Spent: Rs. {total}</Text>

        <View>
          <Text>{editId === null ? 'Add Expense' : 'Edit Expense'}</Text>
          <TextInput placeholder="Item name" value={name} onChangeText={setName} />
          <TextInput
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <Button
            title={editId === null ? 'Add Expense' : 'Update Expense'}
            onPress={save}
          />
          {editId !== null && (
            <Button title="Cancel" onPress={clearForm} />
          )}
        </View>

        <Button title="View Edit History" onPress={openHistory} />

        <Text>Your Expenses ({items.length})</Text>

        {items.length === 0 ? (
          <Text>No expenses yet. Add your first one above.</Text>
        ) : (
          items.map((item) => (
            <View key={item.id}>
              <View>
                <Text>{item.name}</Text>
                <Text>Rs. {item.price}</Text>
              </View>
              <Button title="Edit" onPress={() => editItem(item)} />
              <Button title="Delete" onPress={() => deleteItem(item)} />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
