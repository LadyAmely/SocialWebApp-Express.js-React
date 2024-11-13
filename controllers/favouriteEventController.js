const sequelize = require('../config/db');
const {FavouriteEvent, Event} = require('../models');

exports.createFavouriteEvent = async (req, res) => {
    const { username, event_id } = req.body;

    if (!username || !event_id) {
        return res.status(400).json({ error: 'Username and event_id are required' });
    }

    try {
        const existingEvent = await FavouriteEvent.findOne({
            where: { username, event_id }
        });

        if (existingEvent) {
            return res.status(200).json({ message: 'Event already marked as favourite' });
        }

        const favouriteEvent = await FavouriteEvent.create({ username, event_id });

        res.status(201).json(favouriteEvent);
    } catch (error) {
        console.error('Error creating favourite event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getFavouriteEvent =  async(req, res)=>{
    try{
        const { username } = req.params;
        const results = await sequelize.query(
            'SELECT events.* \n' +
            '             FROM favourite_events \n' +
            '             JOIN events ON favourite_events.event_id = events.event_id \n' +
            '             WHERE favourite_events.username = :username',
            {
                replacements: { username: username },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).json(results);

    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};