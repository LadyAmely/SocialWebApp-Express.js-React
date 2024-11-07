const sequelize = require('../config/db');

exports.getCommentMainPostsById = async (req, res) => {
    try{
        const { id } = req.params;
        const results = await sequelize.query(
            'SELECT * FROM comments_main_posts WHERE post_id = :id',
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

exports.createCommentMainPosts = async (req, res) => {
    const{username, post_id, comment_text, created_at} = req.body;
    if(!username || !post_id || !comment_text || !created_at){
        return res.status(400).json({ error: '400 error' });
    }

    try{
        const comment = await sequelize.query(
            'INSERT INTO comments_main_posts(username, post_id, comment_text, created_at) VALUES (:username, :post_id, :comment_text, NOW())',
            {
                replacements: {username, post_id, comment_text},
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json({ id: comment[0], username, post_id, comment_text});

    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
};