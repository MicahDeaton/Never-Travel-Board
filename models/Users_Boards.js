const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class Users_Boards extends Model {}

Users_Boards.init(
  {
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'Users_Boards',
  }
);

module.exports = Users_Boards;
