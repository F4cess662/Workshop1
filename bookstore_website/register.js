
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('registerForm').addEventListener('submit', e=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const users = BookApp.users();
    if(users.some(u=>u.email===fd.get('email'))){ BookApp.toast('อีเมลนี้ถูกใช้งานแล้ว'); return; }
    const user = {id:'u'+Date.now(),name:fd.get('name'),email:fd.get('email'),phone:fd.get('phone'),password:fd.get('password'),role:'customer'};
    BookApp.saveUsers([...users,user]); BookApp.setCurrentUser(user); BookApp.toast('สมัครสมาชิกสำเร็จ'); setTimeout(()=>location.href='profile.html',700);
  });
});
