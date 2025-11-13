const db = require('../config/database');

const getAllPromocodes = (req, res) => {
  try {
    const { isActive } = req.query;
    let promocodes = Array.from(db.promocodes.values());

    if (isActive === 'true') {
      const now = new Date();
      promocodes = promocodes.filter(p => 
        p.isActive && 
        new Date(p.validFrom) <= now && 
        new Date(p.validUntil) >= now
      );
    }

    promocodes = promocodes.map(({ usedBy, ...rest }) => rest);

    res.json({ success: true, promocodes, count: promocodes.length });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const validatePromocode = (req, res) => {
  try {
    const { code, orderAmount, userId } = req.body;

    if (!code || !orderAmount) {
      return res.status(400).json({ error: 'Code and order amount are required' });
    }

    const promo = db.promocodes.get(code.toUpperCase());

    if (!promo) {
      return res.status(404).json({ 
        success: false, 
        valid: false, 
        message: 'Invalid promocode' 
      });
    }

    const now = new Date();
    
    if (!promo.isActive) {
      return res.json({ 
        success: false, 
        valid: false, 
        message: 'This promocode is no longer active' 
      });
    }

    if (new Date(promo.validFrom) > now || new Date(promo.validUntil) < now) {
      return res.json({ 
        success: false, 
        valid: false, 
        message: 'Promocode has expired' 
      });
    }

    if (orderAmount < promo.minOrderAmount) {
      return res.json({ 
        success: false, 
        valid: false, 
        message: `Minimum order amount is ₹${promo.minOrderAmount}` 
      });
    }

    const userUsageCount = promo.usedBy.filter(u => u === userId).length;
    if (userUsageCount >= promo.usageLimit) {
      return res.json({ 
        success: false, 
        valid: false, 
        message: 'You have reached the usage limit for this promocode' 
      });
    }

    let discountAmount = 0;
    if (promo.discountType === 'flat') {
      discountAmount = promo.discountValue;
    } else if (promo.discountType === 'percentage') {
      discountAmount = (orderAmount * promo.discountValue) / 100;
      discountAmount = Math.min(discountAmount, promo.maxDiscount);
    } else if (promo.discountType === 'delivery') {
      discountAmount = promo.discountValue;
    }

    res.json({ 
      success: true, 
      valid: true, 
      promocode: promo,
      discountAmount: Math.round(discountAmount),
      message: 'Promocode applied successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const createPromocode = (req, res) => {
  try {
    const { code, description, discountType, discountValue, minOrderAmount, maxDiscount, usageLimit, validFrom, validUntil, isActive } = req.body;

    if (!code || !discountType || !discountValue || !minOrderAmount) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const upperCode = code.toUpperCase();
    
    if (db.promocodes.has(upperCode)) {
      return res.status(400).json({ error: 'Promocode already exists' });
    }

    const newPromocode = {
      code: upperCode,
      description: description || '',
      discountType,
      discountValue: parseFloat(discountValue),
      minOrderAmount: parseFloat(minOrderAmount),
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : 0,
      usageLimit: usageLimit || 1,
      validFrom: validFrom || new Date().toISOString(),
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: isActive !== undefined ? isActive : true,
      usedBy: [],
      createdAt: new Date().toISOString()
    };

    db.promocodes.set(upperCode, newPromocode);

    res.status(201).json({ 
      success: true, 
      message: 'Promocode created successfully', 
      promocode: newPromocode 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const updatePromocode = (req, res) => {
  try {
    const upperCode = req.params.code.toUpperCase();
    const promo = db.promocodes.get(upperCode);
    
    if (!promo) {
      return res.status(404).json({ error: 'Promocode not found' });
    }

    const updatedPromo = {
      ...promo,
      ...req.body,
      code: upperCode,
      updatedAt: new Date().toISOString()
    };

    db.promocodes.set(upperCode, updatedPromo);

    res.json({ 
      success: true, 
      message: 'Promocode updated successfully', 
      promocode: updatedPromo 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const deletePromocode = (req, res) => {
  try {
    const upperCode = req.params.code.toUpperCase();
    const promo = db.promocodes.get(upperCode);
    
    if (!promo) {
      return res.status(404).json({ error: 'Promocode not found' });
    }

    db.promocodes.delete(upperCode);

    res.json({ success: true, message: 'Promocode deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const applyPromocode = (req, res) => {
  try {
    const upperCode = req.params.code.toUpperCase();
    const promo = db.promocodes.get(upperCode);
    
    if (!promo) {
      return res.status(404).json({ error: 'Promocode not found' });
    }

    promo.usedBy.push(req.user.id);
    db.promocodes.set(upperCode, promo);

    res.json({ 
      success: true, 
      message: 'Promocode applied successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = {
  getAllPromocodes,
  validatePromocode,
  createPromocode,
  updatePromocode,
  deletePromocode,
  applyPromocode
};