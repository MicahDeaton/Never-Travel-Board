const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Locations extends Model {}

const URLLEN = 320; // Maximum characters to store a URL

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
      allowNull: true,
    },
    location_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location_imageurl: {
      type: DataTypes.STRING(URLLEN),
    },
    location_notes: {
      type: DataTypes.STRING(4096),
    },
    location_duration: {
      type: DataTypes.TIME,
    },
    tripadvisor_placeid: {
      type: DataTypes.STRING(64),
    },
    google_placeid: {
      type: DataTypes.STRING(32),
    },
    // Add more columns for Google text search result data
    // https://developers.google.com/maps/documentation/places/web-service/search-text#maps_http_places_textsearch-sh
    business_status: {
      type: DataTypes.STRING(32),
    },
    formatted_address: {
      type: DataTypes.STRING(512),
    },
    icon: {
      type: DataTypes.STRING(URLLEN),
    },
    icon_background_color: {
      type: DataTypes.STRING(8),
    },
    icon_mask_base_uri: {
      type: DataTypes.STRING(URLLEN),
    },
    rating: {
      type: DataTypes.FLOAT,
    },
    user_ratings_total: {
      type: DataTypes.INTEGER,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
    // keep track of the last user that selected this location
    selectedbyuser: {
      type: DataTypes.INTEGER,
    },
    // keep track of whether the location is flagged or shortlisted
    flagged: {
      type: DataTypes.INTEGER,
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
