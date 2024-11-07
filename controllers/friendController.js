const sequelize = require('../config/db');
const { Friend } = require('../models');

exports.getFriendsByUsername = async(req, res) => {
    try {
        const { username } = req.params;
        const friends = await Friend.findAll({
            where: { username },
            attributes: ['friend_user'],
        });

        res.status(200).json(friends);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

