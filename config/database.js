const bcrypt = require('bcryptjs');

const db = {
  users: new Map([
    ['admin@snazo.com', {
      id: 'user_1',
      name: 'Admin',
      email: 'admin@snazo.com',
      password: bcrypt.hashSync('admin123', 10),
      isAdmin: true,
      createdAt: new Date().toISOString()
    }]
  ]),
  
  products: new Map([
    ['1', { 
      id: '1', 
      name: "Chicken Samosa", 
      description: "Golden triangles bursting with spiced minced chicken and crispy crunch.", 
      price: 446, 
      originalPrice: 520, 
      image: "https://i.pinimg.com/736x/44/06/97/440697c5fbae4617192c2f96b34799f9.jpg", 
      discount: true, 
      category: 'chicken', 
      weight: '400g', 
      inStock: true, 
      popular: false 
    }],
    ['2', { 
      id: '2', 
      name: "Chicken Cheese Samosa", 
      description: "Juicy chicken meets molten cheddar in every flaky bite", 
      price: 535, 
      originalPrice: 600, 
      image: "https://i.pinimg.com/736x/af/8a/ba/af8aba63b95d69e8d6750e7a4b901714.jpg", 
      discount: true, 
      category: 'chicken', 
      weight: '400g', 
      inStock: true, 
      popular: false 
    }],
    ['3', { 
      id: '3', 
      name: "Chicken Kanthari Cutlet", 
      description: "Fiery green chili heat hugs tender chicken in a crisp shell.", 
      price: 446, 
      originalPrice: null, 
      image: "https://i.pinimg.com/736x/dd/8a/ca/dd8aca65e4841e33dd58d721d5753437.jpg", 
      discount: false, 
      category: 'chicken', 
      weight: '400g', 
      inStock: true, 
      popular: false 
    }],
    ['4', { 
      id: '4', 
      name: "Chicken Cutlet", 
      price: 407, 
      description: "Classic spiced chicken patty, fried to juicy, golden perfection.", 
      image: "https://i.pinimg.com/736x/38/61/8d/38618d806558124a21c40b9d368c551a.jpg", 
      discount: false, 
      category: 'chicken', 
      weight: '400g', 
      inStock: true, 
      popular: false 
    }],
    ['5', { 
      id: '5', 
      name: "Chicken Spring Roll", 
      description: "Flaky rolls packed with savory chicken and veggie snap.", 
      price: 485, 
      originalPrice: null, 
      image: "https://i.pinimg.com/1200x/60/42/49/604249c513b50ade35a405c272fd5c44.jpg", 
      discount: false, 
      category: 'chicken', 
      weight: '400g', 
      inStock: true, 
      popular: true 
    }]
  ]),
  
  pincodes: new Map([
    ['673001', { 
      pincode: '673001', 
      area: 'Kozhikode City', 
      deliveryCharge: 30, 
      isActive: true, 
      estimatedTime: '30-45 mins' 
    }],
    ['673002', { 
      pincode: '673002', 
      area: 'West Hill', 
      deliveryCharge: 40, 
      isActive: true, 
      estimatedTime: '35-50 mins' 
    }],
    ['673003', { 
      pincode: '673003', 
      area: 'Nadakkavu', 
      deliveryCharge: 35, 
      isActive: true, 
      estimatedTime: '30-45 mins' 
    }],
    ['673004', { 
      pincode: '673004', 
      area: 'Calicut Beach', 
      deliveryCharge: 50, 
      isActive: true, 
      estimatedTime: '40-55 mins' 
    }],
    ['673005', { 
      pincode: '673005', 
      area: 'Vellayil', 
      deliveryCharge: 45, 
      isActive: true, 
      estimatedTime: '35-50 mins' 
    }]
  ]),
  
  promocodes: new Map([
    ['WELCOME50', {
      code: 'WELCOME50',
      description: 'Welcome offer - ₹50 off on orders above ₹500',
      discountType: 'flat',
      discountValue: 50,
      minOrderAmount: 500,
      maxDiscount: 50,
      usageLimit: 1,
      validFrom: new Date('2024-01-01').toISOString(),
      validUntil: new Date('2025-12-31').toISOString(),
      isActive: true,
      usedBy: []
    }],
    ['SNAZO20', {
      code: 'SNAZO20',
      description: '20% off on all orders',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 300,
      maxDiscount: 200,
      usageLimit: 3,
      validFrom: new Date('2024-01-01').toISOString(),
      validUntil: new Date('2025-12-31').toISOString(),
      isActive: true,
      usedBy: []
    }],
    ['FREESHIP', {
      code: 'FREESHIP',
      description: 'Free delivery on orders above ₹800',
      discountType: 'delivery',
      discountValue: 100,
      minOrderAmount: 800,
      maxDiscount: 100,
      usageLimit: 5,
      validFrom: new Date('2024-01-01').toISOString(),
      validUntil: new Date('2025-12-31').toISOString(),
      isActive: true,
      usedBy: []
    }]
  ]),
  
  orders: []
};

module.exports = db;