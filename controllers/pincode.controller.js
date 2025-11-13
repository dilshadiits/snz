const db = require('../config/database');

const getAllPincodes = (req, res) => {
  try {
    const { isActive } = req.query;
    let pincodes = Array.from(db.pincodes.values());

    if (isActive === 'true') {
      pincodes = pincodes.filter(p => p.isActive === true);
    }

    res.json({ success: true, pincodes, count: pincodes.length });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const checkPincode = (req, res) => {
  try {
    const pincode = db.pincodes.get(req.params.pincode);
    
    if (!pincode) {
      return res.status(404).json({ 
        success: false, 
        available: false, 
        message: 'Delivery not available in this area' 
      });
    }

    if (!pincode.isActive) {
      return res.status(200).json({ 
        success: false, 
        available: false, 
        message: 'Delivery temporarily unavailable in this area' 
      });
    }

    res.json({ 
      success: true, 
      available: true, 
      pincode 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const createPincode = (req, res) => {
  try {
    const { pincode, area, deliveryCharge, estimatedTime, isActive } = req.body;

    if (!pincode || !area || !deliveryCharge) {
      return res.status(400).json({ error: 'Pincode, area, and delivery charge are required' });
    }

    if (db.pincodes.has(pincode)) {
      return res.status(400).json({ error: 'Pincode already exists' });
    }

    const newPincode = {
      pincode,
      area,
      deliveryCharge: parseFloat(deliveryCharge),
      estimatedTime: estimatedTime || '30-45 mins',
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date().toISOString()
    };

    db.pincodes.set(pincode, newPincode);

    res.status(201).json({ 
      success: true, 
      message: 'Pincode added successfully', 
      pincode: newPincode 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const updatePincode = (req, res) => {
  try {
    const pincode = db.pincodes.get(req.params.pincode);
    
    if (!pincode) {
      return res.status(404).json({ error: 'Pincode not found' });
    }

    const updatedPincode = {
      ...pincode,
      ...req.body,
      pincode: req.params.pincode,
      updatedAt: new Date().toISOString()
    };

    db.pincodes.set(req.params.pincode, updatedPincode);

    res.json({ 
      success: true, 
      message: 'Pincode updated successfully', 
      pincode: updatedPincode 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const deletePincode = (req, res) => {
  try {
    const pincode = db.pincodes.get(req.params.pincode);
    
    if (!pincode) {
      return res.status(404).json({ error: 'Pincode not found' });
    }

    db.pincodes.delete(req.params.pincode);

    res.json({ success: true, message: 'Pincode deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = {
  getAllPincodes,
  checkPincode,
  createPincode,
  updatePincode,
  deletePincode
};
