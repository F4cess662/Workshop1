WarmRead Store - Front-end Demo

วิธีเปิดใช้งาน
1. แตกไฟล์ ZIP
2. เปิด index.html ด้วยเว็บเบราว์เซอร์
3. ระบบใช้ Local Storage จำลองฐานข้อมูล จึงทดลองสั่งซื้อ/ชำระเงิน/อัปเดตสถานะได้ทันที

บัญชีทดลอง
- ลูกค้า: customer@example.com / 123456
- พนักงาน: staff@example.com / 123456
- แอดมิน: admin@example.com / 123456

หน้าที่สำคัญ
- index.html: หน้าหลัก
- products.html: รายการหนังสือ ค้นหา และกรอง
- book-detail.html: รายละเอียดหนังสือ
- favorites.html: รายการโปรด
- cart.html: ตะกร้าสินค้า
- checkout.html: ที่อยู่จัดส่งและขนส่ง
- payment.html: ชำระเงินและแนบสลิป
- tracking.html: ติดตามคำสั่งซื้อ
- staff.html: ตรวจสลิป จัดเตรียม และอัปเดตจัดส่ง
- admin.html: Dashboard สินค้า สต็อก พนักงาน และรายงาน

ลำดับสถานะที่ปรับใหม่
1. ลูกค้าแนบสลิป: paymentStatus = pending, orderStatus = pending_review, product = reserved
2. พนักงานอนุมัติ: paymentStatus = approved, orderStatus = packing, ระบบตัดสต็อกครั้งเดียว
3. พนักงานส่งสินค้า: orderStatus = shipped, deliveryStatus = in_transit
4. ลูกค้ายืนยันรับสินค้า: orderStatus = completed, deliveryStatus = delivered
5. ถ้าสลิปไม่ผ่าน: paymentStatus = rejected, orderStatus = cancelled, คืนสถานะสินค้า

หมายเหตุ
- เวอร์ชันนี้เปลี่ยน Storage key เป็น v2 เพื่อให้ข้อมูลเดิมจากเวอร์ชันก่อนหน้าไม่ปนกัน
- ไม่มี Backend จริง จึงเหมาะสำหรับส่งงาน Front-end / Demo ตาม Scope
