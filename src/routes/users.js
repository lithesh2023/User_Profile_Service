// users.js
const express = require('express');
const passport = require('passport');

const router = express.Router();


// Authenticate user
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

// Dashboard (after successful login)
router.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('Welcome to the dashboard!');
  } else {
    res.redirect('/login');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
