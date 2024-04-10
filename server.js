const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/simple_api');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    deleted: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

const SECRET_KEY = 'ae8a8fc38a015a7e0b95c1efc2f5f4145f6b9aaceeb8f7c7c8483c5dc21cbea1';

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/users', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
  
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      res.status(201).send('User created successfully');
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
}); 

app.get('/users', authenticateToken, async (req, res) => {
  const users = await User.find({ deleted: false });
  res.json(users);
});

app.get('/users/:id', authenticateToken, async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

app.put('/users/:id', authenticateToken, async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, password } = req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      if (name) {
        user.name = name;
      }
      if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId) {
          return res.status(400).json({ error: 'Email already in use' });
        }
        user.email = email;
      }
      if (password) {
        if (password.length < 8) {
          return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
  
      await user.save();
      res.send('User updated successfully');
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});  

app.delete('/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    user.deleted = true;
    await user.save();
    res.send('User deleted successfully');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/auth/token', (req, res) => {
  const userId = shortid.generate();
  const token = jwt.sign({ userId }, SECRET_KEY);

  console.log('Generated token:', token);

  res.json({ token });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
