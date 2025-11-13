const db = require('../config/database');

const createOrder = (req, res) => {
  try {
    const { items, deliveryAddress, pincode, promocode, totalAmount, deliveryCharge } = req.body;

    if (!items || !deliveryAddress || !pincode || !totalAmount) {
      return res.status(400).json({ error: 'Required order information missing' });
    }

    const orderId = `ORD${Date.now()}`;
    const newOrder = {
      orderId,
      userId: req.user.id,
      items,
      deliveryAddress,
      pincode,
      promocode: promocode || null,
      totalAmount: parseFloat(totalAmount),
      deliveryCharge: parseFloat(deliveryCharge || 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString()
    };

    db.orders.push(newOrder);

    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully', 
      order: newOrder 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const getUserOrders = (req, res) => {
  try {
    const userOrders = db.orders.filter(o => o.userId === req.user.id);
    res.json({ success: true, orders: userOrders, count: userOrders.length });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const getAllOrders = (req, res) => {
  try {
    res.json({ success: true, orders: db.orders, count: db.orders.length });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders
};
