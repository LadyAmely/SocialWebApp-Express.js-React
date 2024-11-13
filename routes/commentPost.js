const express = require('express');
const router = express.Router();
const commentPostController = require('../controllers/commentPostController');

router.post('/', commentPostController.createCommentPost);
router.get('/', commentPostController.getCommentPost);

module.exports = router;