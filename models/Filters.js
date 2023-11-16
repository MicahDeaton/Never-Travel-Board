const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const Boards = require('./Boards');

class Filters extends Model {}

Filters.init(
  {
    board_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Boards,
        key: 'board_id',
        unique: false,
      },
    },
    filter_name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'filters',
  }
);

module.exports = Filters;
