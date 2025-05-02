const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const isAuthenticated = require('../middleware/isAuthenticated');

// View all posts
router.get('/', isAuthenticated, async (req, res) => {
  const posts = await prisma.post.findMany({ include: { user: true } });
  res.render('forum', { user: req.user, posts });
});

// Create post
router.post('/', isAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  await prisma.post.create({
    data: {
      title,
      content,
      userId: req.user.id,
    },
  });
  res.redirect('/posts');
});

// Delete post (only own)
router.post('/delete', isAuthenticated, async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: req.body.id },
  });
  if (post.userId === req.user.id) {
    await prisma.post.delete({ where: { id: post.id } });
  }
  res.redirect('/posts');
});

module.exports = router;
