const User = require('./User');
const Boards = require('./Boards');
const Filters = require('./Filters');
const Locations = require('./Locations');
const Userstoboards = require('./Userstoboards');

// A Board can belong to multiple users.  A User can have many boards.
User.belongsToMany(Boards, {
  through: { model: Userstoboards }
});
Boards.belongsToMany(User, {
  through: { model: Userstoboards }
});

// Define a Board as having many Filters
Boards.hasMany(Filters, {
  foreignKey: 'board_id',
  onDelete: 'CASCADE',
});

// A Board can have many Locations
Boards.hasMany(Locations, {
  foreignKey: 'board_id',
  onDelete: 'CASCADE',
})

module.exports = { User, Boards, Filters, Locations, Userstoboards };
