const sequelize = require('../config/db');

exports.getCommentsByNewsId = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await sequelize.query(
            'SELECT * FROM comments WHERE news_id = :id',
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

exports.createPost = async (req, res) => {
    const {username, news_id, comment_text, created_at} = req.body;
    if(!username || !news_id || !comment_text || !created_at){
        return res.status(400).json({ error: '400 error' });
    }
    try{
        const comment = await sequelize.query(
            'INSERT INTO comments(username, news_id, comment_text, created_at) VALUES (:username, :news_id, :comment_text, NOW())',
            {
                replacements: {username, news_id, comment_text},
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json({ id: comment[0], username, news_id, comment_text});
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
};

