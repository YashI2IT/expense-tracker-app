// Expense Tracker backend - https://github.com/YashI2IT/expense-tracker-app
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error('Set JWT_SECRET in backend/.env before starting the server');
}

// data is kept in memory, so it is cleared when the server restarts
let users = [];
let items = [];
let history = [];

// add one line to the edit history
function addHistory(action, details) {
  history.unshift({ id: history.length + 1, action, details, time: new Date().toLocaleString() });
}

// name must be filled and price must be a number greater than 0
function isValid(name, price) {
  return name && !isNaN(price) && price > 0;
}

// open http://localhost:5000 in the browser to check the server
app.get('/', (req, res) => res.send('Expense Tracker backend is running'));

// Register a new user
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  users.push({ id: Date.now(), name: name || 'User', email, password });
  res.json({ message: 'Registered successfully' });
});

// Login and send back a JWT token
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Get all expenses
app.get('/items', (req, res) => res.json(items));

// Add an expense
app.post('/items', (req, res) => {
  const { name } = req.body;
  const price = Number(req.body.price);
  if (!isValid(name, price)) {
    return res.status(400).json({ message: 'Enter a name and a valid price' });
  }
  const newItem = { id: Date.now(), name, price };
  items.push(newItem);
  addHistory('ADDED', `Added "${name}" (Rs.${price})`);
  res.json(newItem);
});

// Edit an expense
app.put('/items/:id', (req, res) => {
  const { name } = req.body;
  const price = Number(req.body.price);
  if (!isValid(name, price)) {
    return res.status(400).json({ message: 'Enter a name and a valid price' });
  }
  const item = items.find((i) => i.id == req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  // save the old values in history first, then change them
  addHistory('EDITED', `Changed "${item.name}" (Rs.${item.price}) to "${name}" (Rs.${price})`);
  item.name = name;
  item.price = price;
  res.json({ message: 'updated' });
});

// Delete an expense
app.delete('/items/:id', (req, res) => {
  const item = items.find((i) => i.id == req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  addHistory('DELETED', `Deleted "${item.name}" (Rs.${item.price})`);
  items = items.filter((i) => i.id != item.id);
  res.json({ message: 'deleted' });
});

// Get the edit history
app.get('/history', (req, res) => res.json(history));

// Express 5 gives an error here if the port is already in use
app.listen(5000, '0.0.0.0', (err) => {
  if (err) {
    console.log('could not start server:', err.message);
    return;
  }
  console.log('server running on port 5000');
});
