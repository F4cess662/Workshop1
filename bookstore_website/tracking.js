document.addEventListener('DOMContentLoaded', render);

function orderItemsHtml(order){
  return order.items.map(item=>`
    <div class="item-row">
      <span>${BookApp.escapeHtml(item.title)} × ${item.qty}</span>
      <strong>${BookApp.formatTHB(item.price * item.qty)}</strong>
    </div>`).join('');
}

function latestLog(order){
  const items = order.timeline || [];
  const item = items[items.length - 1];
  if(!item) return 'ยังไม่มีการอัปเดต';
  return typeof item === 'string' ? item : item.text;
}

function render(){
  if(!BookApp.requireLogin()) return;
  const root = document.getElementById('trackingRoot');
  const user = BookApp.currentUser();
  let orders = BookApp.orders().filter(o => user.role === 'admin' || user.role === 'staff' || o.customerId === user.id || o.customerEmail === user.email);
  const target = new URLSearchParams(location.search).get('order');
  if(target) orders = orders.filter(o=>o.id===target).concat(orders.filter(o=>o.id!==target));
  if(!orders.length){ root.innerHTML = `<div class="empty-state"><h3>ยังไม่มีคำสั่งซื้อ</h3><p>เมื่อชำระเงินและแนบสลิปแล้ว รายการจะอยู่ที่นี่</p><a href="products.html" class="btn btn-primary">เลือกซื้อหนังสือ</a></div>`; return; }
  root.innerHTML = orders.map(o=>`
    <article class="card order-card">
      <div class="order-head">
        <div>
          <span class="order-label">คำสั่งซื้อ</span>
          <h3>${o.id}</h3>
          <p class="helper">${BookApp.dateTH(o.createdAt)} · ${BookApp.escapeHtml(o.customerName)}</p>
        </div>
        <div class="order-total-box">
          <div>ยอดสุทธิ</div>
          <strong>${BookApp.formatTHB(o.total)}</strong>
        </div>
      </div>
      <div class="current-status">
        <div>
          <span class="order-label">สถานะปัจจุบัน</span>
          <strong class="status-text">${BookApp.statusLabel('order',o.orderStatus)}</strong>
          <p class="helper">อัปเดตล่าสุด: ${BookApp.escapeHtml(latestLog(o))}</p>
        </div>
      </div>
      ${BookApp.stepHtml(o)}
      <details class="order-details">
        <summary>รายการสินค้าและที่อยู่</summary>
        <div class="order-items">
          ${orderItemsHtml(o)}
          <div class="item-row"><span>ค่าจัดส่ง</span><strong>${BookApp.formatTHB(o.shipping)}</strong></div>
          <div class="item-row order-total"><span>ยอดสุทธิ</span><strong>${BookApp.formatTHB(o.total)}</strong></div>
        </div>
        <p class="address-line">ที่อยู่: ${BookApp.escapeHtml(o.address?.detail || '-')}</p>
      </details>
      <section class="log-panel" aria-label="Log คำสั่งซื้อ">
        <div class="log-head"></div>
        <ul class="timeline">${BookApp.timelineList(o)}</ul>
      </section>
      <div class="order-actions">${o.deliveryStatus === 'in_transit' ? `<button class="btn btn-success" data-receive="${o.id}">ยืนยันได้รับสินค้า</button>`:''}<a class="btn btn-secondary" href="support.html">ติดต่อสอบถาม</a></div>
    </article>`).join('');
  root.querySelectorAll('[data-receive]').forEach(btn=>btn.onclick=()=>{ const res=BookApp.customerReceive(btn.dataset.receive); BookApp.toast(res.message); render(); });
}
