const sequelize = require('../config/db');

exports.getAllUsers = async(req, res) => {
    try {
        const [results, metadata] = await sequelize.query('SELECT username FROM "Users"');
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};