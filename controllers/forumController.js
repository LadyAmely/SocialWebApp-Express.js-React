const sequelize = require('../config/db');
const { ForumPost} = require('../models');

exports.getAllForumPosts = async(req, res)=> {
    try {
        const forumPosts = await ForumPost.findAll();
        res.status(200).json(forumPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createForumPost = async(req, res)=>{
    const{title, description, username} = req.body;

    if(!description || !title || !username){
        return res.status(400).json({ error: 'Description, title, and username are required' });
    }
    try{
        const forumPost = await ForumPost.create({
            title,
            description,
            username,
            created_at: new Date(),
            updated_at: new Date()
        });

        res.status(201).json({
            id: forumPost.id,
            title,
            description,
            username
        });

    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
