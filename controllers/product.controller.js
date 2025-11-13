const db = require('../config/database');

const getAllProducts = (req, res) => {
  try {
    const { category, popular, inStock, minPrice, maxPrice } = req.query;
    let products = Array.from(db.products.values());

    if (category) {
      products = products.filter(p => p.category === category);
    }
    if (popular === 'true') {
      products = products.filter(p => p.popular === true);
    }
    if (inStock === 'true') {
      products = products.filter(p => p.inStock === true);
    }
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    res.json({ success: true, products, count: products.length });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const getProductById = (req, res) => {
  try {
    const product = db.products.get(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const createProduct = (req, res) => {
  try {
    const { name, description, price, originalPrice, image, category, weight, discount, popular, inStock } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    const productId = `${Date.now()}`;
    const newProduct = {
      id: productId,
      name,
      description: description || '',
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      image: image || '',
      category,
      weight: weight || '400g',
      discount: discount || false,
      popular: popular || false,
      inStock: inStock !== undefined ? inStock : true,
      createdAt: new Date().toISOString()
    };

    db.products.set(productId, newProduct);

    res.status(201).json({ 
      success: true, 
      message: 'Product created successfully', 
      product: newProduct 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const updateProduct = (req, res) => {
  try {
    const product = db.products.get(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = {
      ...product,
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };

    db.products.set(req.params.id, updatedProduct);

    res.json({ 
      success: true, 
      message: 'Product updated successfully', 
      product: updatedProduct 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const deleteProduct = (req, res) => {
  try {
    const product = db.products.get(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    db.products.delete(req.params.id);

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};