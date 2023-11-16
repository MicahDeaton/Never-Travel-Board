const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Locations extends Model {}

Locations.init(
  {
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    location_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location_imageurl: {
      type: DataTypes.STRING,
    },
    location_notes: {
      type: DataTypes.STRING,
    },
    location_duration: {
      type: DataTypes.TIME,
    },
    tripadvisor_placeid: {
      type: DataTypes.STRING,
    },
    google_placeid: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'locations',
  }
);

module.exports = Locations;
