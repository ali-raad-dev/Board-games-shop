import { useState } from 'react';
import { categories, products } from './data';

function Brand() {
  return <a className="brand" href="#top" aria-label="Tabletop and Co. home"><span className="brand-mark">T</span><span>Tabletop <em>&</em> Co.</span></a>;
}

function Header({ cartCount }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className="main-nav" aria-label="Main navigation"><a href="#shop">Shop</a><a href="#categories">Categories</a><a href="#story">Our story</a></nav>
        <div className="header-actions"><button className="icon-button" aria-label="Search">⌕</button><button className="icon-button" aria-label="Account">♙</button><a className="cart-link" href="#cart">Cart <span>{cartCount}</span></a></div>
      </div>
    </header>
  );
}

function ProductArtwork({ accent }) {
  return <div className={`product-art art-${accent}`} aria-hidden="true"><span className="art-shape" /><span className="art-label">PLAY<br />MORE</span></div>;
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">{product.tag && <span className="product-tag">{product.tag}</span>}<ProductArtwork accent={product.accent} /><button className="quick-add" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to cart`}>+</button></div>
      <div className="product-info"><div><p className="product-category">{product.category}</p><h3>{product.name}</h3></div><strong>${product.price.toFixed(2)}</strong></div>
      <div className="product-meta"><span>★ {product.rating}</span><span>{product.players}</span><span>{product.duration}</span></div>
    </article>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All games');
  const visibleProducts = activeCategory === 'All games' ? products : products.filter((product) => product.category === activeCategory);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      return existing ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }];
    });
  }

  return (
    <div id="top">
      <div className="announcement">Free local delivery on orders over $75 <span>•</span> Carefully chosen games, always</div>
      <Header cartCount={cartCount} />
      <main>
        <section className="hero"><div className="hero-copy"><p className="eyebrow">The good kind of screen time</p><h1>Bring people<br /><i>to the table.</i></h1><p className="hero-text">Thoughtfully chosen board games for curious minds, competitive spirits, and everyone in between.</p><a className="button button-dark" href="#shop">Explore the collection <span>↗</span></a></div><div className="hero-scene" aria-label="A stack of colorful board game pieces"><div className="sun" /><div className="table-shape"><span className="die die-one">5</span><span className="die die-two">●</span><span className="meeple">♟</span><span className="card-stack" /></div><span className="scene-note">Games for<br /><b>good company</b></span></div></section>

        <section className="category-strip" id="categories"><div className="section-heading"><div><p className="eyebrow">Find your next favorite</p><h2>Shop by mood</h2></div><a href="#shop" className="text-link">View all categories <span>↗</span></a></div><div className="category-grid">{categories.map((category) => <a className="category-tile" href="#shop" key={category.name}><div className={`category-art ${category.color}`}><span>{category.name === 'Strategy' ? '♜' : category.name === 'Family' ? '◒' : category.name === 'Party' ? '✦' : '♢'}</span></div><div><h3>{category.name}</h3><p>{category.count} games</p></div><span className="arrow">↗</span></a>)}</div></section>

        <section className="collection" id="shop"><div className="section-heading"><div><p className="eyebrow">A few we love</p><h2>Featured games</h2></div><div className="filter-tabs">{['All games', 'Strategy', 'Family'].map((category) => <button className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)} key={category}>{category}</button>)}</div></div><div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}</div></section>

        <section className="story" id="story"><div className="story-art"><span className="story-card card-a">PLAY<br />TOGETHER</span><span className="story-card card-b">NO<br />PHONES</span><span className="story-piece">✦</span></div><div className="story-copy"><p className="eyebrow">More than a shop</p><h2>Make room<br /><i>for play.</i></h2><p>We believe the best nights start with a little curiosity. Our shelves are filled with games we have played, loved, and would gladly teach again.</p><a className="button button-outline" href="#top">Meet the team <span>↗</span></a></div></section>
      </main>
      <footer><Brand /><p>Good games. Better company.</p><span>© 2026 Tabletop & Co.</span></footer>
      {cartCount > 0 && <div className="cart-toast" id="cart">{cartCount} {cartCount === 1 ? 'game' : 'games'} in your cart <button onClick={() => setCart([])}>Clear</button></div>}
    </div>
  );
}

export default App;
