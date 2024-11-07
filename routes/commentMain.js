const express = require('express');
const router = express.Router();
const commentMainController = require('../controllers/commentMainController');

router.get('/:id', commentMainController.getCommentMainPostsById);
router.post('/', commentMainController.createCommentMainPosts);

module.exports = router;