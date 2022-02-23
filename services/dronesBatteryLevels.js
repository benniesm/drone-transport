const fs = require('fs');
const queryDb = require('../db/queryDb');

const droneBatteryLevels = async() => {  
  const getData = async() => {
    queryDb('drones', null, 'serialNumber, batteryCapacity');
    const allDronesBatteries = await queryDb.getManyRows();
    
    if (allDronesBatteries.hasOwnProperty('errno')) {
      return console.log(allDronesBatteries);
    }

    let logData = JSON.stringify({
      timestamp: new Date(),
      levels: allDronesBatteries
    });
    logData += '\n';

    fs.appendFile('batteryLevelHistory.log', logData, (err) => {
      if (err) throw err;
    });
  };
  await getData();
};

module.exports = droneBatteryLevels;