const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');
const User = require('./User');
const Boards = require('./Boards');

class Users_Boards extends Model {}

Users_Boards.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    board_board_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'boards',
        key: 'board_id',
      },
    },
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
