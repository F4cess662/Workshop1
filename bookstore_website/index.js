document.addEventListener('DOMContentLoaded', () => {
  const products = BookApp.products();

  const categories = [...new Set(products.map(product => product.category))].slice(0, 6);
  document.getElementById('homeKpis').innerHTML = categories.map(category =>
    `<a class="category-pill" href="products.html">${BookApp.escapeHtml(category)}</a>`
  ).join('');

  const features = [
    ['ค้นหาหนังสือ','ค้นหาชื่อ ผู้แต่ง หรือหมวดหมู่ได้ทันที'],
    ['รายการโปรด','บันทึกหนังสือที่สนใจไว้กลับมาดูภายหลัง'],
    ['ตะกร้าและยอดชำระ','เพิ่ม ลด ลบสินค้า และคำนวณค่าจัดส่ง'],
    ['ชำระเงิน','แนบสลิปเพื่อให้พนักงานตรวจสอบ'],
    ['ติดตามพัสดุ','ดูสถานะคำสั่งซื้อและยืนยันรับสินค้า'],
    ['แดชบอร์ด','ดูยอดขาย สต็อก และสินค้าใกล้หมด']
  ];
  const featureRoot = document.getElementById('featureList');
  if(featureRoot){
    featureRoot.innerHTML = features.map(([title,desc])=>`
      <article class="card card-hover">
        <h3>${title}</h3>
        <p>${desc}</p>
      </article>`).join('');
  }

  const featured = products.slice(0,4).map(BookApp.bookCard).join('');
  document.getElementById('featuredBooks').innerHTML = featured;
  BookApp.bindGlobalActions(document.getElementById('featuredBooks'));
});
