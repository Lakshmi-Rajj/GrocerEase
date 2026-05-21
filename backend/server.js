const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB Connected');
    app.listen(5000, () => console.log(' Server running on port 5000'));
  })
  .catch((err) => console.log('❌ Error:', err));