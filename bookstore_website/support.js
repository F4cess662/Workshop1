
document.addEventListener('DOMContentLoaded',()=>{
  const user=BookApp.currentUser(); if(user) document.querySelector('[name="email"]').value=user.email;
  document.getElementById('supportForm').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);const subject=encodeURIComponent('[WarmRead] '+fd.get('topic'));const body=encodeURIComponent(fd.get('message')+'\n\nติดต่อกลับ: '+fd.get('email'));BookApp.toast('เตรียมส่งอีเมลแจ้งปัญหาแล้ว');setTimeout(()=>{location.href=`mailto:support@warmread.example?subject=${subject}&body=${body}`},500);};
});
