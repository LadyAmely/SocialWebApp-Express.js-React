const sequelize = require('../config/db');

exports.createForumPostComment = async (req, res) => {
    const{username, forum_post_id, comment_text, created_at} = req.body;
    if(!username || !forum_post_id || !comment_text || !created_at){
        return res.status(400).json({ error: '400 error' });
    }

    try{
        const comment = await sequelize.query(
            'INSERT INTO comment_forum_posts(username, forum_post_id, comment_text, created_at) VALUES (:username, :forum_post_id, :comment_text, NOW())',
            {
                replacements: {username, forum_post_id, comment_text},
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json({ id: comment[0], username, forum_post_id, comment_text});

    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
};

exports.getForumPostCommentById = async (req, res) => {
    try{
        const { id } = req.params;
        const results = await sequelize.query(
            'SELECT * FROM comment_forum_posts WHERE forum_post_id = :id',
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

