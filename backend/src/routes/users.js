const express = require('express');
const pool = require('../config/db');
const { hashPassword, verifyPassword } = require('../utils/password');
const router = express.Router();

router.put('/:userId', async (req, res) => {
  const { name, phone, password } = req.body;
  try {
    const fields = ['full_name = ?', 'phone = ?'];
    const values = [name || null, phone || null];
    if (password) { fields.push('password_hash = ?'); values.push(await hashPassword(password)); }
    values.push(req.params.userId);
    const [result] = await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`, values);
    if (!result.affectedRows) return res.status(404).json({ ok: false, message: 'User not found' });
    res.json({ ok: true });
  } catch (error) { res.status(500).json({ ok: false, message: 'Failed to update profile', error: error.message }); }
});

router.post('/:userId/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ ok: false, message: 'currentPassword and newPassword are required' });
  }

  if (String(newPassword).length < 6) {
    return res.status(400).json({ ok: false, message: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' });
  }

  try {
    const [rows] = await pool.query('SELECT password_hash FROM users WHERE user_id = ? LIMIT 1', [req.params.userId]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found' });
    }

    const validPassword = await verifyPassword(currentPassword, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ ok: false, message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
    }

    const passwordHash = await hashPassword(newPassword);
    await pool.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [passwordHash, req.params.userId]);

    res.json({ ok: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Failed to change password', error: error.message });
  }
});

module.exports = router;
