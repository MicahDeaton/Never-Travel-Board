const sequelize = require('../config/connection');

// Import sequelize models
const {
  User,
  Boards,
  Filters,
  Locations,
  Userstoboards,
} = require('../models');

// Seed data
const userData = require('./userData.json');
const boardsData = require('./boardsData.json');
const filtersData = require('./filtersData.json');
const locationData = require('./locationData.json');
const users_boardsData = require('./users_boards.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  // const users = await User.bulkCreate(userData, {
  //   individualHooks: true,
  //   returning: true,
  // });
  for (const user of userData) {
    await User.create({
      ...user,
    });
  }

  for (const board of boardsData) {
    await Boards.create({
      ...board,
    });
  }

  for (const filter of filtersData) {
    await Filters.create({
      ...filter,
    });
  }

  for (const location of locationData) {
    await Locations.create({
      ...location,
    });
  }

  // add seed data for the relationship between boards and users
  console.log('seedata\n', users_boardsData);

  // The following sequelize calls for a many-to-many table gives a parameter error when trying to populate JSON data, so we bypass using parameterized queries
  // -----
  for (const usersboards of users_boardsData) {
    await Userstoboards.create({
      ...usersboards,
    });
  }

  // add seed data for the relationship between boards and users, not using parameterized queries (may be subject to SQL injection attacks)
  // const { QueryTypes } = require('sequelize');

  // for (let i of users_boardsData) {
  //   console.log(i.user_id, '\n', i.board_board_id);
  //   await sequelize.query(
  //     'INSERT INTO `userstoboards` (`user_id`,`board_board_id`) VALUES (?,?)',
  //     {
  //       replacements: [i.user_id, i.board_board_id],
  //       type: QueryTypes.INSERT,
  //     }
  //   );
  // }

  console.log;

  process.exit(0);
};

seedDatabase();
