const sequelize = require('../config/connection');
const { User, Boards, Filters, Location } = require('../models');

const userData = require('./userData.json');
const boardsData = require('./boardsData.json');
const filtersData = require('./filtersData.json');
const locationData = require('./locationData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const board of boardsData) {
    await Boards.create({
      ...board,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  for (const filter of filtersData) {
    await Filters.create({
      ...filter,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  for (const location of locationData) {
    await Location.create({
      ...location,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  process.exit(0);
};

seedDatabase();
