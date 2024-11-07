'use strict';
const {
    Model, Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Friend extends Model {
        static associate(models) {
        }
    }
    Friend.init({
        friend_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        friend_user: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        id: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        modelName: 'Friend',
        tableName: 'friends',
        timestamps: false,
        underscored: true,
    });

    return Friend;
};