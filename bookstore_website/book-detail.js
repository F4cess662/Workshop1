document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('detailRoot');
  const id = new URLSearchParams(location.search).get('id') || 'b001';
  const product = BookApp.findProduct(id);
  if(!product){
    root.innerHTML = `<div class="empty-state"><div class="icon">${BookApp.icon('book')}</div><h3>ไม่พบหนังสือ</h3><a href="products.html" class="btn btn-primary">กลับไปหน้ารายการหนังสือ</a></div>`;
    return;
  }
  const related = BookApp.products().filter(p=>p.category===product.category && p.id!==product.id).slice(0,4);
  const favActive = BookApp.favorites().includes(product.id);
  root.innerHTML = `
    <div class="detail-layout">
      <div class="book-cover detail-cover ${product.cover}"><span class="cover-icon">${BookApp.icon('book')}</span><strong class="cover-title">${BookApp.escapeHtml(product.title)}</strong></div>
      <article class="card detail-panel">
        <div class="detail-meta">
          <span class="badge orange">${BookApp.escapeHtml(product.category)}</span>
          <span class="badge green">คะแนน ${product.rating}</span>
          <span class="badge ${product.stock<100?'red':'green'}">คงเหลือ ${product.stock} เล่ม</span>
          ${BookApp.statusBadge('product', product.status)}
        </div>
        <h1>${BookApp.escapeHtml(product.title)}</h1>
        <p class="helper">ผู้แต่ง: ${BookApp.escapeHtml(product.author)} · ขายแล้ว ${product.sold} เล่ม</p>
        <p class="detail-desc">${BookApp.escapeHtml(product.desc)}</p>
        <div class="notice">แนะนำหนังสือหมวดเดียวกันไว้ด้านล่าง เพื่อช่วยเลือกเล่มที่ใกล้เคียงกัน</div>
        <div class="buy-box">
          <div><span class="helper">ราคาเล่มละ</span><div class="price" style="font-size:34px">${BookApp.formatTHB(product.price)}</div></div>
          <div class="pill-row">
            <button class="btn btn-secondary" id="favBtn">${BookApp.icon(favActive?'heartFill':'heart')} ${favActive?'อยู่ในรายการโปรด':'บันทึกโปรด'}</button>
            <button class="btn btn-primary" data-cart="${product.id}">${BookApp.icon('cart')} เพิ่มลงตะกร้า</button>
          </div>
        </div>
      </article>
    </div>
    <div class="section-title recommend-title"><div><h2>หนังสือที่เกี่ยวข้อง</h2><p>หมวด ${BookApp.escapeHtml(product.category)}</p></div></div>
    <div class="book-grid">${related.length ? related.map(BookApp.bookCard).join('') : '<div class="empty-state" style="grid-column:1/-1">ยังไม่มีหนังสือที่เกี่ยวข้อง</div>'}</div>`;
  document.getElementById('favBtn').addEventListener('click', (e)=>{
    const active = BookApp.toggleFavorite(product.id);
    e.currentTarget.innerHTML = `${BookApp.icon(active?'heartFill':'heart')} ${active?'อยู่ในรายการโปรด':'บันทึกโปรด'}`;
    BookApp.renderNav();
  });
  BookApp.bindGlobalActions(root);
});
