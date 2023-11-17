const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Boards extends Model {}

Boards.init(
  {
    board_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    board_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    board_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'boards',
  }
);

module.exports = Boards;
