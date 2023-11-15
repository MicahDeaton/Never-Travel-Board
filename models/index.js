const User = require('./User');
const Boards = require('./Boards');
const Filters = require('./Filters');
const Locations = require('./Locations');
const Users_Boards = require('./Users_Boards');

User.belongsToMany(Boards, { through: 'Users_Boards' });
Boards.belongsToMany(User, { through: 'Users_Boards' });

module.exports = { User, Boards, Filters, Locations, Users_Boards };
