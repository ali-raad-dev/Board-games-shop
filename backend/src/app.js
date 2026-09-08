const express = require('express');
const cors = require('cors');
const { requireAuth } = require('./middleware/auth');
const auth = require('./routes/auth');
const catalog = require('./routes/products');
const cart = require('./routes/cart');

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5173' }));
app.use(express.json());

app.get('/api/health', (request, response) => response.json({ status: 'ok', phase: 4 }));
app.post('/api/auth/register', auth.register);
app.post('/api/auth/login', auth.login);
app.get('/api/categories', catalog.listCategories);
app.get('/api/products', catalog.listProducts);
app.get('/api/products/:productId', catalog.getProduct);
app.get('/api/cart', requireAuth, cart.getCart);
app.post('/api/cart/items', requireAuth, cart.addItem);
app.put('/api/cart/items/:itemId', requireAuth, cart.updateItem);

app.use((request, response) => response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.' } }));
app.use((error, request, response, next) => { console.error(error); response.status(500).json({ error: { code: 'SERVER_ERROR', message: 'An unexpected server error occurred.' } }); });

module.exports = app;