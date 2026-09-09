const { carts, orders, products } = require('../data/mockData');
const { requireStripe } = require('../services/stripe');

function getCartTotal(cart) {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function getCurrentCart(userId) {
  return carts.get(userId) || [];
}

async function createPaymentIntent(request, response, next) {
  try {
    const cart = getCurrentCart(request.user.id);
    if (!cart.length) return response.status(400).json({ error: { code: 'EMPTY_CART', message: 'Add at least one product before checkout.' } });
    const stripe = requireStripe();
    const total = getCartTotal(cart);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { userId: String(request.user.id) },
    });
    response.status(201).json({ data: { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id, amount: total } });
  } catch (error) {
    next(error);
  }
}

async function createOrder(request, response, next) {
  try {
    const { paymentIntentId, shippingAddress } = request.body;
    if (!paymentIntentId || !shippingAddress?.recipientName || !shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.postalCode || !shippingAddress?.country) {
      return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'A payment intent and complete shipping address are required.' } });
    }
    const stripe = requireStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.metadata.userId !== String(request.user.id) || paymentIntent.status !== 'succeeded') {
      return response.status(400).json({ error: { code: 'PAYMENT_NOT_CONFIRMED', message: 'The payment has not been successfully confirmed.' } });
    }
    const cart = getCurrentCart(request.user.id);
    const unavailable = cart.find((item) => { const product = products.find((entry) => entry.id === item.productId); return !product || item.quantity > product.stockQuantity; });
    if (unavailable) return response.status(409).json({ error: { code: 'OUT_OF_STOCK', message: 'One or more products are no longer available.' } });
    const total = getCartTotal(cart);
    const order = { id: orders.length + 1, userId: request.user.id, status: 'paid', totalAmount: total, items: cart.map((item) => ({ ...item })), shippingAddress: { ...shippingAddress }, payment: { provider: 'stripe', providerReference: paymentIntent.id, status: 'succeeded', amount: total }, createdAt: new Date().toISOString() };
    orders.push(order);
    carts.set(request.user.id, []);
    response.status(201).json({ data: order });
  } catch (error) {
    next(error);
  }
}

function listOrders(request, response) {
  response.json({ data: orders.filter((order) => order.userId === request.user.id) });
}

function getReceipt(request, response) {
  const order = orders.find((item) => item.id === Number(request.params.orderId) && item.userId === request.user.id);
  if (!order) return response.status(404).json({ error: { code: 'ORDER_NOT_FOUND', message: 'Order not found.' } });
  response.type('html').send(`<main><h1>Tabletop &amp; Co. receipt</h1><p>Order #${order.id}</p><p>Status: ${order.status}</p><p>Total: $${order.totalAmount.toFixed(2)}</p><p>Payment: ${order.payment.providerReference}</p><p>Thank you for your order.</p></main>`);
}

async function handleStripeWebhook(request, response, next) {
  try {
    const stripe = requireStripe();
    const signature = request.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(request.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    const order = orders.find((item) => item.payment.providerReference === event.data.object.id);
    if (order && event.type === 'payment_intent.payment_failed') order.status = 'cancelled';
    if (order && event.type === 'payment_intent.succeeded') order.status = 'paid';
    response.json({ received: true });
  } catch (error) {
    next(error);
  }
}

module.exports = { createPaymentIntent, createOrder, listOrders, getReceipt, handleStripeWebhook };
