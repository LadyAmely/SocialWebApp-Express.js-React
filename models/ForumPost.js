'use strict';
const {
    Model, Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ForumPost extends Model {
        static associate(models) {
        }
    }
    ForumPost.init({
        forum_post_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        likes: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'ForumPost',
        tableName: 'forum_posts',
        timestamps: false,
        underscored: true,
    });

    return ForumPost;
};
