document.addEventListener('DOMContentLoaded', () => {
  const products = BookApp.products();

  const categories = [...new Set(products.map(product => product.category))].slice(0, 6);
  document.getElementById('homeKpis').innerHTML = categories.map(category =>
    `<a class="category-pill" href="products.html">${BookApp.escapeHtml(category)}</a>`
  ).join('');

  const featured = [...products]
    .sort((a, b) => (Number(b.sold) || 0) - (Number(a.sold) || 0))
    .map(BookApp.bookCard)
    .join('');
  document.getElementById('featuredBooks').innerHTML = featured;
  BookApp.bindGlobalActions(document.getElementById('featuredBooks'));
});
