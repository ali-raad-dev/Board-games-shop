const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error?.message || 'The request could not be completed.');
  return body;
}

export function getProducts(query = '') { return request(`/products${query}`); }
export function registerAccount(payload) { return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }); }
export function loginAccount(payload) { return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }); }
export function getProfile(token) { return request('/auth/me', { headers: { Authorization: `Bearer ${token}` } }); }
export function createPaymentIntent(token) { return request('/checkout/payment-intent', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); }
export function syncCart(token, items) { return request('/cart', { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ items }) }); }
export function createOrder(token, payload) { return request('/orders', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }); }
export function getOrders(token) { return request('/orders', { headers: { Authorization: `Bearer ${token}` } }); }
export async function getReceipt(token, orderId) { const response = await fetch(`${API_URL}/orders/${orderId}/receipt`, { headers: { Authorization: `Bearer ${token}` } }); if (!response.ok) throw new Error('Receipt unavailable.'); return response.text(); }
export { API_URL };
