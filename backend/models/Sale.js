const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  items: [
    {
      product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name:     String,
      quantity: Number,
      price:    Number
    }
  ],
  total:     { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);