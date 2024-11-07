const express = require('express');
const router = express.Router();
const commentGroupsController = require('../controllers/commentGroupsController');

router.get('/:id', commentGroupsController.getCommentGroupsById);
router.post('/', commentGroupsController.createCommentGroups);

module.exports = router;