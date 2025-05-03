const express = require('express');
const bcrypt = require('bcrypt');
const supabase = require('../supabase'); // Use Supabase instead of SQLite

const router = express.Router();

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Query the admin from Supabase
    const { data: adminUsers, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .limit(1);
    
    if (error) throw error;
    
    const adminUser = adminUsers.length > 0 ? adminUsers[0] : null;
    
    if (!adminUser) {
      // User not found
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, adminUser.password_hash);
    
    if (isMatch) {
      // Passwords match - Login successful
      // In a real app, generate a JWT token here and send it back
      console.log(`Admin user '${username}' logged in successfully.`);
      res.status(200).json({ message: 'Login successful' }); // Keep it simple for now
    } else {
      // Passwords don't match
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error during admin login:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
