const bcrypt = require('bcryptjs');

const products = [
  { id: 1, name: 'Wingspan', category: 'Strategy', price: 49.99, stockQuantity: 8, rating: 4.9 },
  { id: 2, name: 'Cascadia', category: 'Family', price: 34.99, stockQuantity: 12, rating: 4.8 },
  { id: 3, name: 'Root', category: 'Strategy', price: 59.99, stockQuantity: 5, rating: 4.7 },
  { id: 4, name: 'Azul', category: 'Family', price: 39.99, stockQuantity: 10, rating: 4.8 },
];

const users = [
  {
    id: 1,
    name: 'Store Administrator',
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync('admin-password-change-me', 12),
    role: 'admin',
  },
];
const carts = new Map();
const orders = [];

module.exports = { products, users, carts, orders };
