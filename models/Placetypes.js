const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const Locations = require('./Locations');

class Placetypes extends Model {}

Placetypes.init(
  {
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Locations,
        key: 'location_id',
        unique: false,
      },
    },
    // this is to keep track of the place type from the source, ie. tourist_attraction, museum, point_of_interest, establishment
    typestr: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    // this is to keep track the type of API source (ie. Google, Yelp, TripAdvisor)
    source: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'placetypes',
  }
);

module.exports = Placetypes;
