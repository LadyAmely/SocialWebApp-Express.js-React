const sequelize = require('../config/db');

const { Event } = require('../models');

exports.getAllEvents = async(req, res)=> {
    try{
        const events = await Event.findAll();
        res.status(200).json(events);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
};

exports.createEvent = async (req, res) => {
    const { description, image_path, username } = req.body;

    if (!description || !image_path || !username) {
        return res.status(400).json({ error: 'Description, image_path, and username are required' });
    }

    try {

        const newEvent = await newEvent.create(
            {
                description,
                created_at: new Date(),
                updated_at: new Date(),
                image_path,
                username
            }
        );

        res.status(201).json({
            id: newEvent.id,
            description,
            image_path,
            username
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
