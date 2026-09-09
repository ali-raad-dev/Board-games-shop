const { carts, products } = require('../data/mockData');

function getCart(request, response) { response.json({ data: carts.get(request.user.id) || [] }); }

function replaceCart(request, response) {
  const requestedItems = Array.isArray(request.body.items) ? request.body.items : [];
  const nextCart = [];

  for (const requestedItem of requestedItems) {
    const product = products.find((item) => item.id === Number(requestedItem.productId));
    const quantity = Number(requestedItem.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > product.stockQuantity) {
      return response.status(409).json({ error: { code: 'OUT_OF_STOCK', message: `${product?.name || 'A product'} is no longer available in that quantity.` } });
    }
    nextCart.push({ productId: product.id, name: product.name, price: product.price, quantity });
  }

  carts.set(request.user.id, nextCart);
  response.json({ data: nextCart });
}

function addItem(request, response) {
  const product = products.find((item) => item.id === Number(request.body.productId));
  const quantity = Number(request.body.quantity);
  if (!product || !Number.isInteger(quantity) || quantity < 1) return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'A valid product and quantity are required.' } });
  const cart = carts.get(request.user.id) || [];
  const existing = cart.find((item) => item.productId === product.id);
  if (existing) existing.quantity += quantity;
  else cart.push({ productId: product.id, name: product.name, price: product.price, quantity });
  carts.set(request.user.id, cart);
  response.status(201).json({ data: cart });
}

function updateItem(request, response) {
  const cart = carts.get(request.user.id) || [];
  const quantity = Number(request.body.quantity);
  const item = cart.find((entry) => entry.productId === Number(request.params.itemId));
  if (!item || !Number.isInteger(quantity) || quantity < 1) return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'A valid item and quantity are required.' } });
  item.quantity = quantity;
  response.json({ data: cart });
}

module.exports = { getCart, replaceCart, addItem, updateItem };