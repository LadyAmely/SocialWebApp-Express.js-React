'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};