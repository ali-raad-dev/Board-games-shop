const express = require('express');
const cors = require('cors');
const { requireAuth, requireRole } = require('./middleware/auth');
const auth = require('./routes/auth');
const catalog = require('./routes/products');
const cart = require('./routes/cart');
const orders = require('./routes/orders');
const admin = require('./routes/admin');

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5173' }));
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), orders.handleStripeWebhook);
app.use(express.json());

app.get('/api/health', (request, response) => response.json({ status: 'ok', phase: 6 }));
app.post('/api/auth/register', auth.register);
app.post('/api/auth/login', auth.login);
app.get('/api/auth/me', requireAuth, auth.getCurrentUser);
app.get('/api/categories', catalog.listCategories);
app.get('/api/products', catalog.listProducts);
app.get('/api/products/:productId', catalog.getProduct);
app.get('/api/cart', requireAuth, cart.getCart);
app.put('/api/cart', requireAuth, cart.replaceCart);
app.post('/api/cart/items', requireAuth, cart.addItem);
app.put('/api/cart/items/:itemId', requireAuth, cart.updateItem);
app.post('/api/checkout/payment-intent', requireAuth, orders.createPaymentIntent);
app.post('/api/orders', requireAuth, orders.createOrder);
app.get('/api/orders', requireAuth, orders.listOrders);
app.get('/api/orders/:orderId/receipt', requireAuth, orders.getReceipt);
app.get('/api/admin/status', requireAuth, requireRole('admin'), (request, response) => response.json({ data: { message: 'Admin authorization is working.', role: request.user.role } }));
app.get('/api/admin/products', requireAuth, requireRole('admin'), admin.listProducts);
app.post('/api/admin/products', requireAuth, requireRole('admin'), admin.createProduct);
app.put('/api/admin/products/:productId', requireAuth, requireRole('admin'), admin.updateProduct);
app.delete('/api/admin/products/:productId', requireAuth, requireRole('admin'), admin.deleteProduct);
app.get('/api/admin/categories', requireAuth, requireRole('admin'), admin.listCategories);
app.post('/api/admin/categories', requireAuth, requireRole('admin'), admin.createCategory);
app.put('/api/admin/categories/:categoryId', requireAuth, requireRole('admin'), admin.updateCategory);
app.delete('/api/admin/categories/:categoryId', requireAuth, requireRole('admin'), admin.deleteCategory);
app.get('/api/admin/orders', requireAuth, requireRole('admin'), admin.listOrders);
app.patch('/api/admin/orders/:orderId/status', requireAuth, requireRole('admin'), admin.updateOrderStatus);
app.get('/api/admin/reports/sales', requireAuth, requireRole('admin'), admin.salesReport);
app.get('/api/admin/reports/top-products', requireAuth, requireRole('admin'), admin.topProducts);

app.use((request, response) => response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.' } }));
app.use((error, request, response, next) => { console.error(error); response.status(error.statusCode || 500).json({ error: { code: error.code || 'SERVER_ERROR', message: error.message || 'An unexpected server error occurred.' } }); });

module.exports = app;