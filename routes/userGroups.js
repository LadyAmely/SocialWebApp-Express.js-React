const express = require('express');
const router = express.Router();
const userGroupsController = require('../controllers/userGroupsController');

router.get('/:id', userGroupsController.getUserGroupsById);

module.exports = router;