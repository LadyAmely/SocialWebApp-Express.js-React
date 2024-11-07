const express = require('express');
const router = express.Router();
const userInfoController = require('../controllers/userInfoController');

router.put('/', userInfoController.updateUserInfo);
router.get('/:username', userInfoController.getUserInfo);

module.exports = router;