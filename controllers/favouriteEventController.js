const sequelize = require('../config/db');

exports.createFavouriteEvent = async(req, res)=> {
    const { username, event_id } = req.body;
    if (!username || !event_id) {
        return res.status(400).json({ error: '400 error' });
    }
    try {

        const [existingEvent] = await sequelize.query(
            'SELECT * FROM favourite_events WHERE username = :username AND event_id = :event_id',
            {
                replacements: { username, event_id },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (existingEvent) {
            return res.status(200).json({ message: 'Event already marked as favourite' });
        }


        const favouriteEvent = await sequelize.query(
            'INSERT INTO favourite_events (username, event_id) VALUES (:username, :event_id)',
            {
                replacements: { username, event_id },
                type: sequelize.QueryTypes.INSERT
            }
        );

        res.status(201).json({ id: favouriteEvent[0], username, event_id });
    } catch (error) {
        console.error(error);
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