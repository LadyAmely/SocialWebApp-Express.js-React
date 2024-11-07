const sequelize = require('../config/db');
const { Post } = require('../models');

exports.getAllPosts = async(req, res)=> {
    try {
        const posts = await Post.findAll();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updatePostById = async (req, res) => {
    const { id } = req.params;
    const { description, image_path } = req.body;

    if (!description || !image_path) {
        return res.status(400).json({ error: 'Description and image_path are required' });
    }

    try {

        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        post.description = description;
        post.image_path = image_path;
        post.updated_at = new Date();

        await post.save();

        res.status(200).json({
            message: 'Post updated successfully',
            post: {
                id: post.id,
                description: post.description,
                image_path: post.image_path,
                updated_at: post.updated_at,
            },
        });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deletePostById = async (req, res) => {
    const { id } = req.params;

    try {

        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        await post.destroy();

        res.status(200).json({ message: `Post with ID ${id} deleted successfully` });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createPost = async (req, res) => {
    const { description, image_path, username } = req.body;

    if (!description || !image_path || !username) {
        return res.status(400).json({ error: 'Description, image_path, and username are required' });
    }

    try {

        const newPost = await Post.create({
            description,
            image_path,
            username,
            created_at: new Date(),
            updated_at: new Date()
        });


        res.status(201).json({
            id: newPost.id,
            description,
            image_path,
            username
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};