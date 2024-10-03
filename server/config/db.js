const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('express-db', 'postgres', 'sql2023', {
    host: 'localhost',
    dialect: 'postgres'
});

sequelize.authenticate()
    .then(() => console.log('Połączenie z bazą danych powiodło się'))
    .catch(err => console.error('Nieudane połączenie:', err));

module.exports = sequelize;