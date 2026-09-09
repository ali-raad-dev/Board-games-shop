import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  createAdminProduct,
  createOrder,
  createPaymentIntent,
  getAdminOrders,
  getAdminProducts,
  getOrders,
  getProducts,
  getSalesReport,
  loginAccount,
  registerAccount,
  syncCart,
  updateAdminOrderStatus,
} from "./api";
import { categories, products as fallbackProducts } from "./data";
import AdminPage from "./AdminPage";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;
const accentByCategory = {
  Strategy: "forest",
  Family: "mountain",
  Party: "tile",
  "Two player": "bird",
};
const normalizeProduct = (product) => ({
  ...product,
  accent: product.accent || accentByCategory[product.category] || "bird",
  players: product.players || "1-4 players",
  duration: product.duration || "30-60 min",
});

function Brand() {
  return (
    <a
      className="brand"
      href="/"
      onClick={(event) => {
        event.preventDefault();
        window.history.pushState({}, "", "/");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }}
    >
      <span className="brand-mark">T</span>
      <span>
        Tabletop <em>&</em> Co.
      </span>
    </a>
  );
}
function Header({ count, user, navigate, logout }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className="main-nav">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/shop")}>Shop</button>
          <button onClick={() => navigate("/#categories")}>Categories</button>
          <button onClick={() => navigate("/story")}>Our story</button>
          {user?.role === "admin" && (
            <button onClick={() => navigate("/admin")}>Admin</button>
          )}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            onClick={() => navigate("/shop")}
            aria-label="Search"
          >
            ⌕
          </button>
          <button
            className="icon-button"
            onClick={() => navigate("/account")}
            aria-label="Account"
          >
            ♙
          </button>
          {user && (
            <button className="logout-link" onClick={logout}>
              Log out
            </button>
          )}
          <button className="cart-link" onClick={() => navigate("/cart")}>
            Cart <span>{count}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
function Artwork({ product }) {
  return (
    <div className={`product-art art-${product.accent}`}>
      <span className="art-label">
        PLAY
        <br />
        MORE
      </span>
    </div>
  );
}
function ProductCard({ product, add, view }) {
  return (
    <article className="product-card">
      <button className="product-image-button" onClick={() => view(product.id)}>
        <div className="product-image-wrap">
          <span className="product-tag">{product.tag || "Shop favorite"}</span>
          <Artwork product={product} />
        </div>
      </button>
      <div className="product-info">
        <div>
          <p className="product-category">{product.category}</p>
          <button className="product-name" onClick={() => view(product.id)}>
            {product.name}
          </button>
        </div>
        <strong>${Number(product.price).toFixed(2)}</strong>
      </div>
      <div className="product-meta">
        <span>★ {product.rating || "4.7"}</span>
        <span>{product.players}</span>
        <span>{product.duration}</span>
      </div>
      <button className="add-button" onClick={() => add(product)}>
        Add to cart
      </button>
    </article>
  );
}
function Home({ navigate, add, view, products }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">The good kind of screen time</p>
          <h1>
            Bring people
            <br />
            <i>to the table.</i>
          </h1>
          <p className="hero-text">
            Thoughtfully chosen board games for curious minds, competitive
            spirits, and everyone in between.
          </p>
          <button
            className="button button-dark"
            onClick={() => navigate("/shop")}
          >
            Explore the collection <span>↗</span>
          </button>
        </div>
        <div className="hero-scene">
          <div className="sun" />
          <div className="table-shape">
            <span className="die die-one">5</span>
            <span className="die die-two">●</span>
            <span className="meeple">♟</span>
            <span className="card-stack" />
          </div>
        </div>
      </section>
      <section className="category-strip" id="categories">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Find your next favorite</p>
            <h2>Shop by mood</h2>
          </div>
          <button className="text-link" onClick={() => navigate("/shop")}>
            View all categories ↗
          </button>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <button
              className={`category-tile ${category.color}`}
              key={category.name}
              onClick={() =>
                navigate(`/shop?category=${encodeURIComponent(category.name)}`)
              }
            >
              <div className="category-art">
                <span>✦</span>
              </div>
              <div>
                <h3>{category.name}</h3>
                <p>{category.count} games</p>
              </div>
              <span className="arrow">↗</span>
            </button>
          ))}
        </div>
      </section>
      <section className="collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A few we love</p>
            <h2>Featured games</h2>
          </div>
          <button className="text-link" onClick={() => navigate("/shop")}>
            See the full shop ↗
          </button>
        </div>
        <div className="product-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              add={add}
              view={view}
            />
          ))}
        </div>
      </section>
      <section className="story" id="story">
        <div className="story-art">
          <span className="story-card card-a">
            PLAY
            <br />
            TOGETHER
          </span>
          <span className="story-card card-b">
            NO
            <br />
            PHONES
          </span>
        </div>
        <div className="story-copy">
          <p className="eyebrow">More than a shop</p>
          <h2>
            Make room
            <br />
            <i>for play.</i>
          </h2>
          <p>Games we have played, loved, and would gladly teach again.</p>
          <button
            className="button button-outline"
            onClick={() => navigate("/story")}
          >
            Read our story ↗
          </button>
        </div>
      </section>
    </>
  );
}
function Shop({ navigate, add, view, products }) {
  const params = new URLSearchParams(location.search);
  const [search, setSearch] = useState(params.get("search") || "");
  const [category, setCategory] = useState(
    params.get("category") || "All categories",
  );
  const [sort, setSort] = useState("Featured");
  const list = products
    .filter(
      (item) =>
        (category === "All categories" || item.category === category) &&
        item.name.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "Low price"
        ? a.price - b.price
        : sort === "High price"
          ? b.price - a.price
          : (b.rating || 0) - (a.rating || 0),
    );
  return (
    <section className="shop-page">
      <div className="page-heading">
        <p className="eyebrow">The collection</p>
        <h1>
          Find your next
          <br />
          <i>favorite game.</i>
        </h1>
        <p>Browse games chosen for memorable nights.</p>
      </div>
      <div className="shop-controls">
        <label>
          Search
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search games"
          />
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>All categories</option>
            {[...new Set(products.map((item) => item.category))].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Sort
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option>Featured</option>
            <option>Low price</option>
            <option>High price</option>
          </select>
        </label>
      </div>
      <div className="shop-result-row">
        <span>{list.length} games</span>
      </div>
      <div className="product-grid">
        {list.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            add={add}
            view={view}
          />
        ))}
      </div>
    </section>
  );
}
function Cart({ cart, update, navigate }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <section className="cart-page">
      <div className="page-heading compact">
        <p className="eyebrow">Your picks</p>
        <h1>
          Your shopping
          <br />
          <i>cart.</i>
        </h1>
      </div>
      {cart.length ? (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <Artwork product={item} />
                <div>
                  <p className="product-category">{item.category}</p>
                  <h3>{item.name}</h3>
                  <strong>${Number(item.price).toFixed(2)}</strong>
                </div>
                <div className="quantity-control">
                  <button onClick={() => update(item.id, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => update(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <button
                  className="remove-button"
                  onClick={() => update(item.id, 0)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <aside className="cart-summary">
            <p className="eyebrow">Order summary</p>
            <div>
              <span>Subtotal</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <hr />
            <button
              className="button button-dark"
              onClick={() => navigate("/checkout")}
            >
              Continue to checkout ↗
            </button>
          </aside>
        </div>
      ) : (
        <div className="empty-state">
          <h2>Your cart is waiting.</h2>
          <button
            className="button button-dark"
            onClick={() => navigate("/shop")}
          >
            Browse the shop ↗
          </button>
        </div>
      )}
    </section>
  );
}
function Auth({ onAuth }) {
  const [register, setRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    try {
      const result = register
        ? await registerAccount(form)
        : await loginAccount({ email: form.email, password: form.password });
      onAuth(result);
    } catch (requestError) {
      setError(requestError.message);
    }
  }
  return (
    <section className="auth-page">
      <p className="eyebrow">Customer account</p>
      <h1>{register ? "Join the table." : "Welcome back."}</h1>
      <form className="auth-form" onSubmit={submit}>
        {register && (
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
            />
          </label>
        )}
        <label>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />
        </label>
        <label>
          Password
          <input
            required
            minLength="8"
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="button button-dark">
          {register ? "Create account" : "Log in"} ↗
        </button>
      </form>
      <button
        className="text-link auth-switch"
        onClick={() => setRegister(!register)}
      >
        {register ? "Already registered? Log in" : "Need an account? Register"}
      </button>
    </section>
  );
}
function CheckoutForm({ token, cart, done }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (!stripe || !elements) return;
    const form = event.currentTarget;
    const shippingAddress = {
      recipientName: form.recipientName.value,
      line1: form.line1.value,
      city: form.city.value,
      postalCode: form.postalCode.value,
      country: form.country.value,
    };
    setBusy(true);
    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (result.error) {
      setError(result.error.message);
      setBusy(false);
      return;
    }
    try {
      const order = await createOrder(token, {
        paymentIntentId: result.paymentIntent.id,
        shippingAddress,
      });
      done(order.data);
    } catch (requestError) {
      setError(requestError.message);
      setBusy(false);
    }
  }
  return (
    <form className="checkout-form" onSubmit={submit}>
      <div className="checkout-fields">
        <label>
          Recipient name
          <input name="recipientName" required />
        </label>
        <label>
          Address
          <input name="line1" required />
        </label>
        <label>
          City
          <input name="city" required />
        </label>
        <label>
          Postal code
          <input name="postalCode" required />
        </label>
        <label>
          Country
          <input name="country" defaultValue="Jordan" required />
        </label>
      </div>
      <PaymentElement />
      {error && <p className="form-error">{error}</p>}
      <button className="button button-dark" disabled={busy || !stripe}>
        {busy ? "Confirming payment..." : "Pay securely"} ↗
      </button>
    </form>
  );
}
function Checkout({ token, cart, navigate, done }) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    (async () => {
      try {
        await syncCart(
          token,
          cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
        );
        const result = await createPaymentIntent(token);
        setSecret(result.data.clientSecret);
      } catch (requestError) {
        setError(requestError.message);
      }
    })();
  }, [token, cart]);
  if (!stripePromise)
    return (
      <section className="placeholder-page">
        <h1>Stripe setup needed.</h1>
        <p>Add `VITE_STRIPE_PUBLISHABLE_KEY` to frontend/.env.</p>
      </section>
    );
  if (error)
    return (
      <section className="placeholder-page">
        <p className="form-error">{error}</p>
        <button
          className="button button-dark"
          onClick={() => navigate("/cart")}
        >
          Back to cart
        </button>
      </section>
    );
  return (
    <section className="checkout-page">
      <div className="page-heading compact">
        <p className="eyebrow">Secure test checkout</p>
        <h1>
          Finish your
          <br />
          <i>order.</i>
        </h1>
      </div>
      {secret ? (
        <Elements stripe={stripePromise} options={{ clientSecret: secret }}>
          <CheckoutForm token={token} cart={cart} done={done} />
        </Elements>
      ) : (
        <p>Preparing secure checkout...</p>
      )}
    </section>
  );
}
function Account({ user, token, navigate, logout }) {
  const [orders, setOrders] = useState([]);
  const orderId = new URLSearchParams(location.search).get("order");
  useEffect(() => {
    getOrders(token).then((result) => setOrders(result.data));
  }, [token]);
  return (
    <section className="account-page">
      {orderId && (
        <div className="payment-success">
          <strong>Payment successful</strong>
          <span>Order #{orderId} has been confirmed.</span>
        </div>
      )}
      <p className="eyebrow">Customer account</p>
      <h1>
        Hello, <i>{user.name}.</i>
      </h1>
      <div className="account-panel">
        <strong>{user.email}</strong>
        <button className="remove-button" onClick={logout}>
          Log out
        </button>
        <div>
          <span className="product-category">Order history</span>
          {orders.length ? (
            orders.map((order) => (
              <div className="order-row" key={order.id}>
                <span>Order #{order.id}</span>
                <span>{order.status}</span>
                <strong>${Number(order.totalAmount).toFixed(2)}</strong>
              </div>
            ))
          ) : (
            <p>
              No orders yet.{" "}
              <button className="text-link" onClick={() => navigate("/shop")}>
                Find a game.
              </button>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
function Story({ navigate }) {
  return (
    <section className="story-page">
      <div className="page-heading">
        <p className="eyebrow">More than a shop</p>
        <h1>
          Make room
          <br />
          <i>for play.</i>
        </h1>
        <p>
          We help people put their phones down, pull up a chair, and find a game
          made for their group.
        </p>
      </div>
      <div className="story-feature">
        <div className="story-art">
          <span className="story-card card-a">
            PLAY
            <br />
            TOGETHER
          </span>
          <span className="story-card card-b">
            NO
            <br />
            PHONES
          </span>
        </div>
        <div className="story-feature-copy">
          <p className="eyebrow">Our point of view</p>
          <h2>
            Good games make
            <br />
            <i>good company.</i>
          </h2>
          <p>
            Every game on our shelves has been played, discussed, and chosen
            because it gives people a reason to spend time together.
          </p>
        </div>
      </div>
      <button className="button button-dark" onClick={() => navigate("/shop")}>
        Explore the collection ↗
      </button>
    </section>
  );
}
function App() {
  const [path, setPath] = useState(
    location.pathname + location.search + location.hash,
  );
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("tabletop-cart") || "[]"),
  );
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("tabletop-user") || "null"),
  );
  const [products, setProducts] = useState(
    fallbackProducts.map(normalizeProduct),
  );
  const token = localStorage.getItem("tabletop-token");
  useEffect(() => {
    const handler = () =>
      setPath(location.pathname + location.search + location.hash);
    addEventListener("popstate", handler);
    return () => removeEventListener("popstate", handler);
  }, []);
  useEffect(() => {
    getProducts()
      .then((result) => setProducts(result.data.map(normalizeProduct)))
      .catch(() => {});
  }, []);
  useEffect(
    () => localStorage.setItem("tabletop-cart", JSON.stringify(cart)),
    [cart],
  );
  function navigate(to) {
    history.pushState({}, "", to);
    setPath(to);
    if (!to.includes("#")) scrollTo(0, 0);
  }
  function add(product) {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      return found
        ? current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...current, { ...product, quantity: 1 }];
    });
  }
  function update(id, quantity) {
    setCart((current) =>
      quantity < 1
        ? current.filter((item) => item.id !== id)
        : current.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
    );
  }
  function authenticated(result) {
    localStorage.setItem("tabletop-token", result.token);
    localStorage.setItem("tabletop-user", JSON.stringify(result.user));
    setUser(result.user);
    navigate(path === "/checkout" ? "/checkout" : path === "/admin" ? "/admin" : "/account");
  }
  function logout() {
    localStorage.removeItem("tabletop-token");
    localStorage.removeItem("tabletop-user");
    setUser(null);
    navigate("/account");
  }
  const productId = path.match(/^\/product\/(\d+)/)?.[1];
  const product = products.find((item) => item.id === Number(productId));
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const authRequired =
    (path.startsWith("/account") || path === "/checkout" || path === "/admin") && !user;
  let page = path.startsWith("/shop") ? (
    <Shop
      navigate={navigate}
      add={add}
      view={(id) => navigate(`/product/${id}`)}
      products={products}
    />
  ) : path === "/cart" ? (
    <Cart cart={cart} update={update} navigate={navigate} />
  ) : path.startsWith("/product/") && product ? (
    <Product product={product} add={add} navigate={navigate} />
  ) : path === "/checkout" && token && user ? (
    <Checkout
      token={token}
      cart={cart}
      navigate={navigate}
      done={(order) => {
        setCart([]);
        navigate(`/account?order=${order.id}`);
      }}
    />
  ) : authRequired ? (
    <Auth onAuth={authenticated} />
  ) : path === "/admin" && user?.role === "admin" ? (
    <AdminPage token={token} />
  ) : path.startsWith("/account") ? (
    <Account user={user} token={token} navigate={navigate} logout={logout} />
  ) : path === "/story" ? (
    <Story navigate={navigate} />
  ) : (
    <Home
      navigate={navigate}
      add={add}
      view={(id) => navigate(`/product/${id}`)}
      products={products}
    />
  );
  return (
    <div id="top">
      <div className="announcement">
        Free local delivery on orders over $75 <span>•</span> Carefully chosen
        games, always
      </div>
      <Header count={count} user={user} navigate={navigate} logout={logout} />
      <main>{page}</main>
      <footer>
        <Brand />
        <p>Good games. Better company.</p>
        <span>© 2026 Tabletop & Co.</span>
      </footer>
      {count > 0 && (
        <button className="cart-toast" onClick={() => navigate("/cart")}>
          {count} games in your cart <span>View cart ↗</span>
        </button>
      )}
    </div>
  );
}
function Product({ product, add, navigate }) {
  return (
    <section className="detail-page">
      <button className="back-link" onClick={() => navigate("/shop")}>
        ← Back to shop
      </button>
      <div className="detail-layout">
        <Artwork product={product} />
        <div className="detail-copy">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="detail-price">${Number(product.price).toFixed(2)}</p>
          <p className="detail-description">
            A beautifully designed game for bringing good people together.
          </p>
          <button className="button button-dark" onClick={() => add(product)}>
            Add to cart ↗
          </button>
        </div>
      </div>
    </section>
  );
}
export default App;
