const sequelize = require('../config/connection');
//const { User, Boards, Filters, Location } = require('../models');
const {
  User,
  Boards,
  Filters,
  Locations,
  Userstoboards,
} = require('../models');

const userData = require('./userData.json');
const boardsData = require('./boardsData.json');
const filtersData = require('./filtersData.json');
const locationData = require('./locationData.json');
const users_boardsData = require('./users_boards.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

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

  console.log('seedata\n', users_boardsData);

  // for (const usersboards of users_boardsData) {
  //   await Users_Boards.create({
  //     ...usersboards,
  //   });
  // }
  // await Users_Boards.create({
  //   user_id: 1,
  //   board_board_id: 1,
  // });
  // await Userstoboards.create({
  //   user_id: 1,
  //   board_board_id: 1,
  // });

  const { QueryTypes } = require('sequelize');

  for (const i of users_boardsData) {
    console.log(i.user_id, '\n', i.board_board_id);
    await sequelize.query(
      'INSERT INTO `userstoboards` (`user_id`,`board_board_id`) VALUES (?,?)',
      {
        replacements: [i.user_id, i.board_board_id],
        type: QueryTypes.INSERT,
      }
    );
  }

  console.log;

  process.exit(0);
};

seedDatabase();
