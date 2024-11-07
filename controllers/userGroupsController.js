const sequelize = require('../config/db');

exports.getUserGroupsById = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await sequelize.query(
            'SELECT title FROM user_groups WHERE user_id = :id',
            {
                replacements: { id: id },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};