const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/:id', commentController.getCommentsByNewsId);
router.post('/', commentController.createPost);

module.exports = router;