const app = () => {
  const express = require('express');
  const router = express.Router();
  const bodyParser = require('body-parser');
  require('dotenv').config();

  const droneBatteryLevels = require('./services/dronesBatteryLevels');

  const drones = require('./routes/drones');
  const medications = require('./routes/medications');
  const loader = require('./routes/loader');

  /**
   * Valid routes of the API
   */
  router.use(express.json());
  router.use('/drones', drones);
  router.use('/medications', medications);
  router.use('/loader', loader);

  router.use('/', (req, res) => {
    res.status(200);
    res.json('Welcome to Drones Rest API.');
  });

  /**
   * Configure API server and start
   */
  const server = express();
  server.use(bodyParser.json());
  server.use('/', router);

  let appServer;
  const startServer = async() => {
    const portToListen = process.env.PORT || 4000;
    appServer = server.listen(portToListen, () => {
      console.log(`Drones Rest API on standby at Port ${portToListen}.`);
    }); 
  }

  startServer();

  /**
   * Start periodic battery level checking (Every 30 seconds)
   */
  setInterval(() => {
    droneBatteryLevels();
  }, 30000);

  return appServer;
};

module.exports = app;