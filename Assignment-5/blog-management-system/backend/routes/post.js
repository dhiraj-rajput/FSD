const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');

// Routes
router.route('/')
  .get(getAllPosts)
  .post(createPost);

router.route('/:id')
  .get(getPostById)
  .put(updatePost)
  .delete(deletePost);

module.exports = router;