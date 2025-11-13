const express = require('express');
const router = express.Router();
const { 
  getAllPromocodes, 
  validatePromocode, 
  createPromocode, 
  updatePromocode, 
  deletePromocode, 
  applyPromocode 
} = require('../controllers/promocode.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', getAllPromocodes);
router.post('/validate', authenticateToken, validatePromocode);
router.post('/', authenticateToken, requireAdmin, createPromocode);
router.put('/:code', authenticateToken, requireAdmin, updatePromocode);
router.delete('/:code', authenticateToken, requireAdmin, deletePromocode);
router.post('/:code/apply', authenticateToken, applyPromocode);

module.exports = router;