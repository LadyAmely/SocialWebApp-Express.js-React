const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.put('/:id', postController.updatePostById);
router.delete('/:id', postController.deletePostById);
router.post('/', postController.createPost);

module.exports = router;