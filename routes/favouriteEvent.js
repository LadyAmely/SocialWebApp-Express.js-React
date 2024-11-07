const express = require('express');
const router = express.Router();
const favouriteEventController = require('../controllers/favouriteEventController');

router.post('/', favouriteEventController.createFavouriteEvent);
router.get('/:username', favouriteEventController.getFavouriteEvent);

module.exports = router;