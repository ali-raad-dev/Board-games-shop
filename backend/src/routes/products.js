const { products } = require('../data/mockData');

function listProducts(request, response) {
  const search = request.query.search?.toLowerCase() || '';
  const category = request.query.category;
  const result = products.filter((product) => product.name.toLowerCase().includes(search) && (!category || product.category === category));
  response.json({ data: result, count: result.length });
}

function getProduct(request, response) {
  const product = products.find((item) => item.id === Number(request.params.productId));
  if (!product) return response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found.' } });
  response.json({ data: product });
}

function listCategories(request, response) {
  response.json({ data: [...new Set(products.map((product) => product.category))] });
}

module.exports = { listProducts, getProduct, listCategories };