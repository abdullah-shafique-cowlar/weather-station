require('dotenv').config()
const db = require("./models");
const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
});

// Shut down the server when the process is terminated
process.on('SIGTERM', () => {
  console.log('Server Shutting down gracefully');
  server.close(() => {
    console.log('[-] Server closed');
  });
});