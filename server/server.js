require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

app.use('/users', userRoutes);

app.post('/auth/token', (req, res) => {
  const userId = shortid.generate();
  const token = jwt.sign({ userId }, process.env.SECRET_KEY);
  res.json({ token });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
