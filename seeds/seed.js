const sequelize = require('../config/connection');
// const { User, Boards, Filters, Location } = require('../models');
const { User, Boards, Filters, Locations, Users_Boards } = require('../models');

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

  // for (const usersboards of users_boardsData) {
  //   await Users_Boards.create({
  //     ...usersboards,
  //   });
  // }

  console.log

  process.exit(0);
};

seedDatabase();
