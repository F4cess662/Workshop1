document.addEventListener('DOMContentLoaded',()=>{
  if(!BookApp.requireRole(['staff','admin'])) return;
  render('all');
  document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    render(b.dataset.filter);
  });
});
function render(filter){
  const orders=BookApp.orders();
  document.getElementById('staffKpis').innerHTML=`
    <div class="kpi"><div><strong>${orders.filter(o=>o.paymentStatus==='pending').length}</strong><span>รอตรวจสลิป</span></div></div>
    <div class="kpi"><div><strong>${orders.filter(o=>o.orderStatus==='packing').length}</strong><span>จัดเตรียม</span></div></div>
    <div class="kpi"><div><strong>${orders.filter(o=>o.deliveryStatus==='in_transit').length}</strong><span>กำลังจัดส่ง</span></div></div>`;
  let list=orders;
  if(filter==='pending') list=list.filter(o=>o.paymentStatus==='pending');
  if(filter==='shipping') list=list.filter(o=>o.deliveryStatus==='in_transit');
  if(filter==='closed') list=list.filter(o=>['completed','cancelled'].includes(o.orderStatus));
  const root=document.getElementById('staffOrders');
  root.innerHTML=list.length?list.map(o=>{
    const canApprove=o.paymentStatus==='pending' && o.orderStatus!=='cancelled';
    const canReject=o.paymentStatus==='pending' && o.orderStatus!=='cancelled';
    const canPack=o.paymentStatus==='approved' && !['shipped','completed','cancelled'].includes(o.orderStatus);
    const canShip=o.paymentStatus==='approved' && !['shipped','completed','cancelled'].includes(o.orderStatus);
    return `<article class="card staff-order">
      <div class="order-head"><div><h3>${o.id}</h3><p class="helper">ลูกค้า: ${BookApp.escapeHtml(o.customerName)} · ${BookApp.dateTH(o.createdAt)}<br>สลิป: ${BookApp.escapeHtml(o.slipName)} · ยอด ${BookApp.formatTHB(o.total)}</p></div></div>
      <p class="staff-status-line">ชำระเงิน: ${BookApp.statusLabel('payment',o.paymentStatus)} · คำสั่งซื้อ: ${BookApp.statusLabel('order',o.orderStatus)} · พัสดุ: ${BookApp.statusLabel('delivery',o.deliveryStatus)}</p>
      ${BookApp.stepHtml(o)}
      <ul class="timeline">${BookApp.timelineList(o)}</ul>
      <div class="staff-actions">
        <button class="btn btn-secondary btn-small" data-slip="${o.id}" ${o.slipData?'':'disabled'}>ดูสลิป</button>
        <button class="btn btn-success btn-small" data-approve="${o.id}" ${canApprove?'':'disabled'}>อนุมัติสลิป</button>
        <button class="btn btn-danger btn-small" data-reject="${o.id}" ${canReject?'':'disabled'}>ไม่ผ่าน</button>
        <button class="btn btn-info btn-small" data-pack="${o.id}" ${canPack?'':'disabled'}>จัดเตรียม</button>
        <button class="btn btn-primary btn-small" data-ship="${o.id}" ${canShip?'':'disabled'}>ส่งสินค้า</button>
      </div>
    </article>`;
  }).join(''):`<div class="empty-state"><h3>ไม่มีรายการในหมวดนี้</h3></div>`;
  bindStaffActions(filter);
}
function bindStaffActions(filter){
  const user=BookApp.currentUser();
  document.querySelectorAll('[data-slip]').forEach(b=>b.onclick=()=>openSlipModal(b.dataset.slip));
  document.querySelectorAll('[data-approve]').forEach(b=>b.onclick=()=>{ const res=BookApp.approveOrder(b.dataset.approve,user.name); BookApp.toast(res.message); render(filter); });
  document.querySelectorAll('[data-reject]').forEach(b=>b.onclick=()=>{ const res=BookApp.rejectOrder(b.dataset.reject,user.name); BookApp.toast(res.message); render(filter); });
  document.querySelectorAll('[data-pack]').forEach(b=>b.onclick=()=>{ const res=BookApp.updateOrderStage(b.dataset.pack,'packing',user.name); BookApp.toast(res.message); render(filter); });
  document.querySelectorAll('[data-ship]').forEach(b=>b.onclick=()=>{ const res=BookApp.updateOrderStage(b.dataset.ship,'shipped',user.name); BookApp.toast(res.message); render(filter); });
}

function openSlipModal(orderId){
  const order = BookApp.orders().find(o=>o.id===orderId);
  if(!order || !order.slipData){ BookApp.toast('รายการนี้ไม่มีรูปสลิป'); return; }
  document.querySelector('.modal-backdrop')?.remove();
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  const isImage = (order.slipType || '').startsWith('image/') || String(order.slipData).startsWith('data:image/');
  const slipBody = isImage
    ? `<img class="slip-full" src="${order.slipData}" alt="สลิปการโอนเงินของ ${BookApp.escapeHtml(order.id)}">`
    : `<div class="slip-file-card"><strong>${BookApp.escapeHtml(order.slipName)}</strong><a class="btn btn-primary btn-small" href="${order.slipData}" target="_blank" rel="noopener">เปิดไฟล์</a></div>`;
  modal.innerHTML = `<div class="modal-card"><div class="modal-head"><div><h3>สลิปการชำระเงิน</h3><p class="helper">${BookApp.escapeHtml(order.id)} · ยอด ${BookApp.formatTHB(order.total)}</p></div><button class="btn btn-secondary btn-small" data-close-modal>ปิด</button></div>${slipBody}</div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click',e=>{ if(e.target === modal || e.target.closest('[data-close-modal]')) modal.remove(); });
}