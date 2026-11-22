const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// get all items
app.get('/items', (req, res) => {
  res.json(items);
});

// add new item
app.post('/items', (req, res) => {
  const newItem = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price
  };
  items.push(newItem);
  res.json(newItem);
});

// update item
app.put('/items/:id', (req, res) => {
  const id = req.params.id;
  for (let i = 0; i < items.length; i++) {
    if (items[i].id == id) {
      items[i].name = req.body.name;
      items[i].price = req.body.price;
    }
  }
  res.json({ message: 'updated' });
});

// delete item
app.delete('/items/:id', (req, res) => {
  const id = req.params.id;
  items = items.filter((item) => item.id != id);
  res.json({ message: 'deleted' });
});

app.listen(5000, () => {
  console.log('server running on port 5000');
});