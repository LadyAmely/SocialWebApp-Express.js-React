const sequelize = require('../config/db');

exports.getAllGroups = async(req, res) => {
    try {
        const [results, metadata] = await sequelize.query('SELECT * FROM groups'
        );
        res.status(200).json(results);
    }catch(error){
        console.error('Error fetching news posts:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};


exports.createGroupPost = async(req, res) => {
    const{description, image_path, username} = req.body;

    if(!description || !image_path || !username){
        return res.status(400).json({ error: 'Description, image_path, and username are required' });
    }
    try{
        const eventPost = await sequelize.query(
            'INSERT INTO groups (description, created_at, updated_at, image_path, username) VALUES (:description, NOW(), NOW(), :image_path, :username)',
            {
                replacements: {description, image_path, username},
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json({ id: eventPost[0], description, image_path, username });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};