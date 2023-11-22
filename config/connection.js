const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: '127.0.0.1',
      dialect: 'mysql',
      port: 3306
    }
  );
}
// connection.connect( (err) => {
//   if (err){
//       console.log(err)
//   }
//   else
//   {
//       console.log("Database connected!")
//   }
// });

//console.log("Our Google API is ", process.env.GOOGLE_API);

var myconfig = {
  UNSPLASH_API: 'hToCtEKI4Nj4xaC0jwg5Tva4DupP-vhbXhJ-mCiry5Y',
  GOOGLE_API: 'AIzaSyDAKGh9hM6lkhtz5MNmuUehgwnvtLVjYr8',
};

module.exports = sequelize;
