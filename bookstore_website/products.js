document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('searchInput');
  const cat = document.getElementById('categorySelect');
  const stock = document.getElementById('stockSelect');
  const grid = document.getElementById('productsGrid');
  const categories = [...new Set(BookApp.products().map(p=>p.category))];
  cat.innerHTML += categories.map(c=>`<option value="${BookApp.escapeHtml(c)}">${BookApp.escapeHtml(c)}</option>`).join('');
  function render(){
    const q = search.value.trim().toLowerCase();
    let items = BookApp.products().filter(p => [p.title,p.author,p.category].join(' ').toLowerCase().includes(q));
    if(cat.value !== 'all') items = items.filter(p=>p.category===cat.value);
    if(stock.value === 'ready') items = items.filter(p=>p.stock>0);
    if(stock.value === 'low') items = items.filter(p=>p.stock<100);
    grid.innerHTML = items.length ? items.map(BookApp.bookCard).join('') : `<div class="empty-state" style="grid-column:1/-1"><div class="icon">${BookApp.icon('search')}</div><h3>ไม่พบหนังสือ</h3><p>ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</p></div>`;
    BookApp.bindGlobalActions(grid);
  }
  [search,cat,stock].forEach(el=>el.addEventListener('input',render));
  render();
});
