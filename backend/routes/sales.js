const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');

// Get all sales
router.get('/', async (req, res) => {
  const sales = await Sale.find().sort({ createdAt: -1 });
  res.json(sales);
});

// Create a sale (billing)
router.post('/', async (req, res) => {
  const { items, total } = req.body;

  // Reduce stock for each item sold
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { quantity: -item.quantity }
    });
  }

  const sale = new Sale({ items, total });
  await sale.save();
  res.json(sale);
});

module.exports = router;