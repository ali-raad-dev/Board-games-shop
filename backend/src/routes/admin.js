const { products, orders } = require('../data/mockData');

const categories = [
  { id: 1, name: 'Strategy', description: 'Planning and long-term decisions.' },
  { id: 2, name: 'Family', description: 'Accessible games for everyone.' },
  { id: 3, name: 'Party', description: 'Social games for groups.' },
  { id: 4, name: 'Two player', description: 'Games designed for two people.' },
];

function listProducts(request, response) { response.json({ data: products }); }
function createProduct(request, response) {
  const { name, category, price, stockQuantity } = request.body;
  if (!name || !category || !Number.isFinite(Number(price)) || Number(price) < 0 || !Number.isInteger(Number(stockQuantity)) || Number(stockQuantity) < 0) return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Name, category, non-negative price, and stock quantity are required.' } });
  const product = { id: Math.max(0, ...products.map((item) => item.id)) + 1, name: name.trim(), category: category.trim(), price: Number(price), stockQuantity: Number(stockQuantity), rating: null };
  products.push(product);
  response.status(201).json({ data: product });
}
function updateProduct(request, response) {
  const product = products.find((item) => item.id === Number(request.params.productId));
  if (!product) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found.' } });
  const { name, category, price, stockQuantity } = request.body;
  if (name !== undefined) product.name = String(name).trim();
  if (category !== undefined) product.category = String(category).trim();
  if (price !== undefined && Number.isFinite(Number(price)) && Number(price) >= 0) product.price = Number(price);
  if (stockQuantity !== undefined && Number.isInteger(Number(stockQuantity)) && Number(stockQuantity) >= 0) product.stockQuantity = Number(stockQuantity);
  response.json({ data: product });
}
function deleteProduct(request, response) {
  const index = products.findIndex((item) => item.id === Number(request.params.productId));
  if (index < 0) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found.' } });
  products.splice(index, 1);
  response.status(204).send();
}
function listCategories(request, response) { response.json({ data: categories }); }
function createCategory(request, response) {
  const { name, description = '' } = request.body;
  if (!name?.trim()) return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Category name is required.' } });
  if (categories.some((category) => category.name.toLowerCase() === name.trim().toLowerCase())) return response.status(409).json({ error: { code: 'CATEGORY_EXISTS', message: 'Category already exists.' } });
  const category = { id: Math.max(0, ...categories.map((item) => item.id)) + 1, name: name.trim(), description: String(description).trim() };
  categories.push(category);
  response.status(201).json({ data: category });
}
function updateCategory(request, response) {
  const category = categories.find((item) => item.id === Number(request.params.categoryId));
  if (!category) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Category not found.' } });
  if (request.body.name?.trim()) category.name = request.body.name.trim();
  if (request.body.description !== undefined) category.description = String(request.body.description).trim();
  response.json({ data: category });
}
function deleteCategory(request, response) {
  const index = categories.findIndex((item) => item.id === Number(request.params.categoryId));
  if (index < 0) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Category not found.' } });
  if (products.some((product) => product.category === categories[index].name)) return response.status(409).json({ error: { code: 'CATEGORY_IN_USE', message: 'Move products before deleting this category.' } });
  categories.splice(index, 1);
  response.status(204).send();
}
function listOrders(request, response) { response.json({ data: orders }); }
function updateOrderStatus(request, response) {
  const allowed = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
  const order = orders.find((item) => item.id === Number(request.params.orderId));
  if (!order) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Order not found.' } });
  if (!allowed.includes(request.body.status)) return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: `Status must be one of: ${allowed.join(', ')}.` } });
  order.status = request.body.status;
  response.json({ data: order });
}
function salesReport(request, response) {
  const revenue = orders.filter((order) => order.status !== 'cancelled').reduce((total, order) => total + Number(order.totalAmount), 0);
  response.json({ data: { totalOrders: orders.length, paidOrders: orders.filter((order) => order.status === 'paid' || order.status === 'delivered' || order.status === 'processing' || order.status === 'shipped').length, revenue: Number(revenue.toFixed(2)) } });
}
function topProducts(request, response) {
  const totals = new Map();
  orders.forEach((order) => order.items?.forEach((item) => totals.set(item.productId, (totals.get(item.productId) || 0) + item.quantity)));
  response.json({ data: [...totals.entries()].map(([productId, quantity]) => ({ productId, quantity })).sort((a, b) => b.quantity - a.quantity).slice(0, 5) });
}

module.exports = { listProducts, createProduct, updateProduct, deleteProduct, listCategories, createCategory, updateCategory, deleteCategory, listOrders, updateOrderStatus, salesReport, topProducts };
