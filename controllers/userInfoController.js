const sequelize = require('../config/db');

exports.updateUserInfo = async (req, res) => {
    const { username, location, interests, observations, constellations } = req.body;
    
    if (!username || !location || !interests || !observations) {
        return res.status(400).json({ error: 'Wszystkie pola są wymagane.' });
    }

    try {
        await sequelize.query(
            'UPDATE user_info SET location = :location, interests = :interests, observations = :observations, constellations = :constellations WHERE username = :username',
            {
                replacements: { username, location, interests, observations, constellations },
                type: sequelize.QueryTypes.UPDATE
            }
        );

        res.status(200).json({ message: 'Informacje o użytkowniku zostały zaktualizowane.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Wewnętrzny błąd serwera' });
    }
};

exports.getUserInfo =  async(req, res)=> {

    const {username} = req.params;
    try{
        const [results, metadata] = await sequelize.query('SELECT * FROM user_info WHERE username = :username', {
            replacements: { username: username },
        });
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(results);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }

};