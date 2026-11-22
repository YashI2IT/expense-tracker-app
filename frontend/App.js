import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editId, setEditId] = useState(null);

  const url = 'http://10.0.2.2:5000/items';

  function loadData() {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleSave() {
    if (name === '' || price === '') {
      return;
    }

    if (editId === null) {
      // add new item
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, price: price })
      }).then(() => {
        setName('');
        setPrice('');
        loadData();
      });
    } else {
      // update existing item
      fetch(url + '/' + editId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, price: price })
      }).then(() => {
        setName('');
        setPrice('');
        setEditId(null);
        loadData();
      });
    }
  }

  function handleDelete(id) {
    fetch(url + '/' + id, {
      method: 'DELETE'
    }).then(() => {
      loadData();
    });
  }

  function handleEdit(item) {
    setEditId(item.id);
    setName(item.name);
    setPrice(String(item.price));
  }

  return (
    <ScrollView style={{ padding: 20, marginTop: 40 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Expense App</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
        style={{ marginBottom: 10, padding: 8 }}
      />

      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={(text) => setPrice(text)}
        keyboardType="numeric"
        style={{ marginBottom: 10, padding: 8 }}
      />

      <Button title={editId ? 'UPDATE' : 'ADD'} onPress={handleSave} />

      {items.map((item) => (
        <View key={item.id} style={{ marginTop: 15 }}>
          <Text style={{ marginBottom: 5 }}>
            {item.name} - Rs.{item.price}
          </Text>
          <Button title="EDIT" onPress={() => handleEdit(item)} />
          <Button title="DELETE" onPress={() => handleDelete(item.id)} />
        </View>
      ))}
    </ScrollView>
  );
}