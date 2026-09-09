const Stripe = require('stripe');

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function requireStripe() {
  const stripe = getStripeClient();
  if (!stripe) {
    const error = new Error('Stripe test mode is not configured. Add STRIPE_SECRET_KEY to backend/.env.');
    error.statusCode = 503;
    error.code = 'PAYMENTS_NOT_CONFIGURED';
    throw error;
  }
  return stripe;
}

module.exports = { getStripeClient, requireStripe };
