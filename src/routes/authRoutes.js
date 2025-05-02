const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Register Page
router.get('/register', (req, res) => {
  res.render('register');
});

// Register Logic
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({ data: { username, password: hashed } });
    res.redirect('/auth/login');
  } catch {
    res.send('User already exists or registration error.');
  }
});

// Login Page
router.get('/login', (req, res) => {
  res.render('login');
});

// Login Logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/posts',
    failureRedirect: '/auth/login',
  })
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
