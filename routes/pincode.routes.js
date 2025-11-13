const express = require('express');
const router = express.Router();
const { 
  getAllPincodes, 
  checkPincode, 
  createPincode, 
  updatePincode, 
  deletePincode 
} = require('../controllers/pincode.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', getAllPincodes);
router.get('/:pincode', checkPincode);
router.post('/', authenticateToken, requireAdmin, createPincode);
router.put('/:pincode', authenticateToken, requireAdmin, updatePincode);
router.delete('/:pincode', authenticateToken, requireAdmin, deletePincode);

module.exports = router;