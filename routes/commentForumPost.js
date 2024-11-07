const express = require('express');
const router = express.Router();
const commentForumPostController = require('../controllers/commentForumPostController');


router.post('/', commentForumPostController.createForumPostComment);
router.get('/:id', commentForumPostController.getForumPostCommentById);

module.exports = router;