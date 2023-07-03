require('dotenv').config()
const app = require('./app');
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
 'users_db',
 'root',
 'root',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Shut down the server when the process is terminated
process.on('SIGTERM', () => {
  console.log('Server Shutting down gracefully');
  server.close(() => {
    console.log('[-] Server closed');
  });
});