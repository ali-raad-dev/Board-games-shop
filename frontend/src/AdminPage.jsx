import { useEffect, useState } from 'react';
import { createAdminProduct, getAdminOrders, getAdminProducts, getSalesReport, updateAdminOrderStatus } from './api';

export default function AdminPage({ token }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [report, setReport] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Strategy', price: '', stockQuantity: '' });
  const [message, setMessage] = useState('');

  async function refresh() {
    const [productResult, orderResult, reportResult] = await Promise.all([getAdminProducts(token), getAdminOrders(token), getSalesReport(token)]);
    setProducts(productResult.data);
    setOrders(orderResult.data);
    setReport(reportResult.data);
  }

  useEffect(() => { refresh().catch((error) => setMessage(error.message)); }, []);

  async function addProduct(event) {
    event.preventDefault();
    try {
      await createAdminProduct(token, { ...form, price: Number(form.price), stockQuantity: Number(form.stockQuantity) });
      setForm({ name: '', category: 'Strategy', price: '', stockQuantity: '' });
      setMessage('Product created.');
      refresh();
    } catch (error) { setMessage(error.message); }
  }

  async function changeStatus(orderId, status) {
    try { await updateAdminOrderStatus(token, orderId, status); refresh(); } catch (error) { setMessage(error.message); }
  }

  return <section className="admin-page"><div className="page-heading"><p className="eyebrow">Admin dashboard</p><h1>Run the<br /><i>shop.</i></h1><p>Manage products, inventory, orders, and sales from one protected workspace.</p></div>{message && <p className="form-error">{message}</p>}{report && <div className="admin-metrics"><div><span>Orders</span><strong>{report.totalOrders}</strong></div><div><span>Paid orders</span><strong>{report.paidOrders}</strong></div><div><span>Revenue</span><strong>${Number(report.revenue).toFixed(2)}</strong></div></div>}<div className="admin-layout"><div><h2>Products</h2><div className="admin-table">{products.map((product) => <div className="admin-row" key={product.id}><span>{product.name}</span><span>{product.category}</span><span>${Number(product.price).toFixed(2)}</span><strong>{product.stockQuantity} in stock</strong></div>)}</div><h2>Orders</h2><div className="admin-table">{orders.length ? orders.map((order) => <div className="admin-row" key={order.id}><span>Order #{order.id}</span><strong>${Number(order.totalAmount).toFixed(2)}</strong><select value={order.status} onChange={(event) => changeStatus(order.id, event.target.value)}><option>pending</option><option>paid</option><option>processing</option><option>shipped</option><option>delivered</option><option>cancelled</option></select></div>) : <p>No orders yet.</p>}</div></div><form className="admin-form" onSubmit={addProduct}><h2>Add product</h2><label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Strategy</option><option>Family</option><option>Party</option><option>Two player</option></select></label><label>Price<input required type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label><label>Stock<input required type="number" min="0" value={form.stockQuantity} onChange={(event) => setForm({ ...form, stockQuantity: event.target.value })} /></label><button className="button button-dark">Create product ↗</button></form></div></section>;
}
