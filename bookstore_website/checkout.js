document.addEventListener('DOMContentLoaded', () => {
  if(!BookApp.requireLogin()) return;
  if(!BookApp.cartDetailed().length){ location.href='cart.html'; return; }
  let selectedAddress = BookApp.addresses()[0]?.id;
  let selectedShipping = 'standard';
  const main = document.getElementById('checkoutMain');
  const summary = document.getElementById('checkoutSummary');
  function render(){
    const addresses = BookApp.addresses();
    main.innerHTML = `
      <section class="card"><h3>ที่อยู่จัดส่ง</h3><div class="grid grid-2" id="addrList">${addresses.map(a=>`<article class="card address-card ${a.id===selectedAddress?'active':''}" data-address="${a.id}"><strong>${BookApp.escapeHtml(a.name)}</strong><p class="helper">${BookApp.escapeHtml(a.receiver)} · ${BookApp.escapeHtml(a.phone)}<br>${BookApp.escapeHtml(a.detail)}</p></article>`).join('')}</div><form id="addrForm" class="form-grid" style="margin-top:14px"><input class="input" name="name" placeholder="ชื่อที่อยู่ เช่น บ้าน" required><input class="input" name="receiver" placeholder="ชื่อผู้รับ" required><input class="input" name="phone" placeholder="เบอร์โทร" required><input class="input" name="detail" placeholder="รายละเอียดที่อยู่" required><button class="btn btn-secondary" type="submit">${BookApp.icon('plus')} เพิ่มที่อยู่</button></form></section>
      <section class="card"><h3>รูปแบบการจัดส่ง</h3><div class="grid grid-3">${BookApp.shippingOptions().map(s=>`<article class="card shipping-card ${s.id===selectedShipping?'active':''}" data-shipping="${s.id}"><strong>${s.name}</strong><p class="helper">${s.desc}</p><span class="price">${BookApp.formatTHB(s.price)}</span></article>`).join('')}</div></section>`;
    document.querySelectorAll('[data-address]').forEach(el=>el.onclick=()=>{selectedAddress=el.dataset.address; render();});
    document.querySelectorAll('[data-shipping]').forEach(el=>el.onclick=()=>{selectedShipping=el.dataset.shipping; render();});
    document.getElementById('addrForm').onsubmit = (e)=>{ e.preventDefault(); const fd=new FormData(e.target); const item={id:'a'+Date.now(),name:fd.get('name'),receiver:fd.get('receiver'),phone:fd.get('phone'),detail:fd.get('detail')}; BookApp.saveAddresses([...BookApp.addresses(),item]); selectedAddress=item.id; BookApp.toast('เพิ่มที่อยู่แล้ว'); render(); };
    renderSummary();
  }
  function renderSummary(){
    const items=BookApp.cartDetailed();
    const subtotal=BookApp.cartTotal();
    const ship=BookApp.shippingOptions().find(s=>s.id===selectedShipping);
    const address=BookApp.addresses().find(a=>a.id===selectedAddress);
    const total=subtotal+(ship?.price||0);
    summary.innerHTML=`<h3 style="margin-top:0;color:var(--brown)">สรุปยอดชำระ</h3>${items.map(i=>`<div class="summary-row"><span>${BookApp.escapeHtml(i.product.title)} × ${i.qty}</span><strong>${BookApp.formatTHB(i.product.price*i.qty)}</strong></div>`).join('')}<div class="summary-row"><span>รวมสินค้า</span><strong>${BookApp.formatTHB(subtotal)}</strong></div><div class="summary-row"><span>${ship.name}</span><strong>${BookApp.formatTHB(ship.price)}</strong></div><div class="summary-row total-row"><span>ยอดสุทธิ</span><span>${BookApp.formatTHB(total)}</span></div><p class="helper">ที่อยู่: ${address ? BookApp.escapeHtml(address.detail) : 'กรุณาเพิ่มที่อยู่'}</p><button class="btn btn-primary" id="payBtn" style="width:100%">ไปหน้าชำระเงิน</button>`;
    document.getElementById('payBtn').onclick=()=>{
      if(!address){ BookApp.toast('กรุณาเพิ่มที่อยู่จัดส่ง'); return; }
      localStorage.setItem(BookApp.STORAGE.checkoutDraft, JSON.stringify({items:items.map(i=>({id:i.id,qty:i.qty,title:i.product.title,price:i.product.price})),subtotal,shipping:ship.price,total,address,shippingMethod:ship}));
      location.href='payment.html';
    };
  }
  render();
});
