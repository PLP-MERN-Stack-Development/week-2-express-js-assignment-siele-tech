// server.js - Starter Express server for Week 2 assignment

// Import required modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'your-secret-api-key';

// Valid categories
const VALID_CATEGORIES = ['electronics', 'kitchen', 'clothing', 'books', 'sports'];

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Custom middleware for logging
const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// Custom middleware for authentication
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }
  next();
};

// Custom error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
};

// Custom error classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(loggerMiddleware);
app.use('/api', authMiddleware);
app.use('/api', limiter);

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// GET /api/products - Get all products with filtering, pagination, and sorting
app.get('/api/products', (req, res) => {
  const { category, page = 1, limit = 10, sort = 'name', order = 'asc' } = req.query;
  let filteredProducts = [...products];

  // Filter by category if provided
  if (category) {
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  // Sort products
  filteredProducts.sort((a, b) => {
    const aValue = a[sort];
    const bValue = b[sort];
    if (order === 'desc') {
      return bValue > aValue ? 1 : -1;
    }
    return aValue > bValue ? 1 : -1;
  });

  // Implement pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    total: filteredProducts.length,
    page: parseInt(page),
    limit: parseInt(limit),
    products: paginatedProducts
  });
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return next(new NotFoundError(`Product with ID ${req.params.id} not found`));
  }
  res.json(product);
});

// POST /api/products - Create a new product
app.post('/api/products', (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  // Validation
  if (!name || !description || !price || !category) {
    return next(new ValidationError('Missing required fields'));
  }

  if (typeof price !== 'number' || price <= 0) {
    return next(new ValidationError('Price must be a positive number'));
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return next(new ValidationError(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`));
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price: Number(price),
    category,
    inStock: Boolean(inStock)
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const productIndex = products.findIndex(p => p.id === req.params.id);

  if (productIndex === -1) {
    return next(new NotFoundError(`Product with ID ${req.params.id} not found`));
  }

  // Validation
  if (!name || !description || !price || !category) {
    return next(new ValidationError('Missing required fields'));
  }

  if (typeof price !== 'number' || price <= 0) {
    return next(new ValidationError('Price must be a positive number'));
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return next(new ValidationError(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`));
  }

  const updatedProduct = {
    ...products[productIndex],
    name,
    description,
    price: Number(price),
    category,
    inStock: Boolean(inStock)
  };

  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res, next) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    return next(new NotFoundError(`Product with ID ${req.params.id} not found`));
  }

  products = products.filter(p => p.id !== req.params.id);
  res.status(204).send();
});

// Search endpoint
app.get('/api/products/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Search query parameter "q" is required' });
  }

  const searchResults = products.filter(p => 
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.description.toLowerCase().includes(q.toLowerCase())
  );

  res.json(searchResults);
});

// Product statistics endpoint
app.get('/api/products/stats', (req, res) => {
  const stats = {
    total: products.length,
    inStock: products.filter(p => p.inStock).length,
    categories: {}
  };

  products.forEach(product => {
    if (!stats.categories[product.category]) {
      stats.categories[product.category] = 0;
    }
    stats.categories[product.category]++;
  });

  res.json(stats);
});

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 