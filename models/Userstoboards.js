const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const User = require('./User');
const Boards = require('./Boards');

class Userstoboards extends Model {}

Userstoboards.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
        unique: false,
      },
    },
    board_board_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Boards,
        key: 'board_id',
        unique: false,
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'userstoboards',
  }
);

module.exports = Userstoboards;
