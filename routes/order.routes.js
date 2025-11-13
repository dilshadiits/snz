const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getUserOrders, 
  getAllOrders 
} = require('../controllers/order.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

router.post('/', authenticateToken, createOrder);
router.get('/', authenticateToken, getUserOrders);
router.get('/all', authenticateToken, requireAdmin, getAllOrders);

module.exports = router;