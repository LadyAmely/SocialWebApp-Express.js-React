const sequelize = require('../config/db');
const { News } = require('../models');

exports.getAllNews = async(req, res) => {
    try {
        const news = await News.findAll();
        res.status(200).json(news);
    }catch(error){
        console.error('Error fetching news posts:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

