document.addEventListener('DOMContentLoaded', render);
function render(){
  const itemsEl = document.getElementById('cartItems');
  const summaryEl = document.getElementById('cartSummary');
  const items = BookApp.cartDetailed();
  if(!items.length){
    itemsEl.innerHTML = `<div class="empty-state"><div class="icon">${BookApp.icon('cart')}</div><h3>ตะกร้ายังว่าง</h3><p>เลือกหนังสือแล้วเพิ่มลงตะกร้า</p><a class="btn btn-primary" href="products.html">เลือกซื้อหนังสือ</a></div>`;
    summaryEl.innerHTML = `<h3>สรุปยอด</h3><p class="helper">ยังไม่มีสินค้าในตะกร้า</p>`;
    return;
  }
  itemsEl.innerHTML = items.map(({product,qty})=>`
    <div class="cart-row">
      <div class="book-cover mini-cover ${product.cover}"><span class="cover-icon">${BookApp.icon('book')}</span><strong class="cover-title">${BookApp.escapeHtml(product.title)}</strong></div>
      <div><h3 style="margin:0;color:var(--brown)">${BookApp.escapeHtml(product.title)}</h3><p class="helper">${BookApp.escapeHtml(product.author)} · คงเหลือ ${product.stock} เล่ม</p><strong class="price">${BookApp.formatTHB(product.price)}</strong></div>
      <div class="cart-actions"><div class="qty-control"><button data-minus="${product.id}">−</button><span>${qty}</span><button data-plus="${product.id}">+</button></div><button class="btn btn-danger btn-small" data-remove="${product.id}" style="margin-left:8px">${BookApp.icon('trash')} ลบ</button></div>
    </div>`).join('');
  const subtotal = BookApp.cartTotal();
  summaryEl.innerHTML = `<h3 style="margin-top:0;color:var(--brown)">สรุปตะกร้า</h3><div class="summary-line"><span>รายการ</span><strong>${items.length}</strong></div><div class="summary-line"><span>จำนวนหนังสือ</span><strong>${items.reduce((s,i)=>s+i.qty,0)} เล่ม</strong></div><div class="summary-line total"><span>รวมสินค้า</span><span>${BookApp.formatTHB(subtotal)}</span></div><a href="checkout.html" class="btn btn-primary" style="width:100%">ดำเนินการสั่งซื้อ</a><a href="products.html" class="btn btn-secondary" style="width:100%;margin-top:10px">เลือกเพิ่ม</a>`;
  itemsEl.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>{ const item=BookApp.cart().find(i=>i.id===b.dataset.plus); BookApp.changeCartQty(b.dataset.plus,item.qty+1); render(); });
  itemsEl.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>{ const item=BookApp.cart().find(i=>i.id===b.dataset.minus); BookApp.changeCartQty(b.dataset.minus,item.qty-1); render(); });
  itemsEl.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{ BookApp.removeCartItem(b.dataset.remove); BookApp.toast('ลบออกจากตะกร้าแล้ว'); render(); });
}
