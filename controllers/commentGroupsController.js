const sequelize = require('../config/db');

exports.getCommentGroupsById = async (req, res) => {
    try{
        const { id } = req.params;
        const results = await sequelize.query(
            'SELECT * FROM comments_groups WHERE group_id = :id',
            {
                replacements: { id: id },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).json(results);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
};

exports.createCommentGroups = async (req, res) => {
    const{username, group_id, comment_text, created_at} = req.body;
    if(!username || !group_id || !comment_text || !created_at){
        return res.status(400).json({ error: '400 error' });
    }

    try{
        const comment = await sequelize.query(
            'INSERT INTO comments_groups(username, group_id, comment_text, created_at) VALUES (:username, :group_id, :comment_text, NOW())',
            {
                replacements: {username, group_id, comment_text},
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json({ id: comment[0], username, group_id, comment_text});

    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }

};