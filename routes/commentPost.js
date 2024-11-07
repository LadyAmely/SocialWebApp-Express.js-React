const express = require('express');
const router = express.Router();
const commentPostController = require('../controllers/commentPostController');

router.get('/', commentPostController.createCommentPost);
router.post('/', commentPostController.getCommentPost);

module.exports = router;