document.addEventListener('DOMContentLoaded', () => {
  if (!BookApp.requireLogin()) return;
  const grid = document.getElementById('favGrid');
  function render(){
    const items = BookApp.products().filter(p=>BookApp.favorites().includes(p.id));
    grid.innerHTML = items.length ? items.map(BookApp.bookCard).join('') : `<div class="empty-state" style="grid-column:1/-1"><div class="icon">${BookApp.icon('heart')}</div><h3>ยังไม่มีรายการโปรด</h3><p>กดปุ่มบันทึกโปรดในหน้าหนังสือ</p><a href="products.html" class="btn btn-primary">ไปเลือกหนังสือ</a></div>`;
    BookApp.bindGlobalActions(grid);
    grid.querySelectorAll('[data-fav]').forEach(btn=>btn.addEventListener('click',()=>setTimeout(render,50)));
  }
  render();
});
