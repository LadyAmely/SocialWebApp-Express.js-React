const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.get('/', communityController.getAllGroups);
router.post('/', communityController.createGroupPost);


module.exports = router;