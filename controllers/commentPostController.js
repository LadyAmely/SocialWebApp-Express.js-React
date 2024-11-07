const sequelize = require('../config/db');

exports.createCommentPost =  async (req, res) => {
    const { forum_post_id, content, username } = req.body;
    if (!forum_post_id || !content || !username) {
        return res.status(400).json({ error: 'forum_post_id, content, and username are required' });
    }
    try {
        const commentPost = await sequelize.query(
            'INSERT INTO comment_posts (forum_post_id, content, created_at, username) VALUES (:forum_post_id, :content, NOW(), :username)',
            {
                replacements: { forum_post_id, content, username },
                type: sequelize.QueryTypes.INSERT,
            }
        );
        res.status(201).json({
            comment_id: commentPost[0],
            forum_post_id,
            content,
            created_at: new Date(),
            username,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getCommentPost = async(req, res) => {
    try {
        const [results, metadata] = await sequelize.query('SELECT * FROM comment_posts');
        res.status(200).json(results);
    }catch(error){
        console.error('Error fetching news posts:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};