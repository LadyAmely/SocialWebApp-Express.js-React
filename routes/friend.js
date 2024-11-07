const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');

router.get('/:username', friendController.getFriendsByUsername);

module.exports = router;