const User = require('./User');
const Boards = require('./Boards');
const Filters = require('./Filters');
const Locations = require('./Locations');
// const Users_Boards = require('./Users_Boards');
const Userstoboards = require('./Userstoboards');

// User.belongsToMany(Boards, { through: { model: Users_Boards, unique: false } });
// Boards.belongsToMany(User, { through: { model: Users_Boards, unique: false } });

User.belongsToMany(Boards, {
  through: { model: Userstoboards, unique: false },
  as: 'myuserboards1',
});
Boards.belongsToMany(User, {
  through: { model: Userstoboards, unique: false },
  as: 'myuserboards2',
});

//module.exports = { User, Boards, Filters, Locations, Users_Boards };
module.exports = { User, Boards, Filters, Locations, Userstoboards };
