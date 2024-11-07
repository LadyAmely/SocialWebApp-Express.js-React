const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

router.get('/', forumController.getAllForumPosts);
router.post('/', forumController.createForumPost);

module.exports = router;