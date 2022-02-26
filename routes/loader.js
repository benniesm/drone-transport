const { response } = require('express');
const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const { loaderAddValidator } = require('../validation/loader');

const queryDb = require('../db/queryDb');

router.get('/:droneId', async(req, res) => {
  queryDb('loadInformation', `droneSerial = "${req.params.droneId}"`);
  const allLoadedForDrone = await queryDb.getManyRows();

  if (allLoadedForDrone.hasOwnProperty('errno')) {
    res.status(500);
    return res.json({ error: allLoadedForDrone });
  }
  res.status(200);
  return res.json({ data: allLoadedForDrone });
});

router.post('/:droneId', loaderAddValidator, async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = req.body;

  // Get drone battery level and state
  queryDb('drones', `serialNumber = "${req.params.droneId}"`, 'weightLimit, batteryCapacity, state');
  const droneData = await queryDb.getOneRow();

  if (!droneData || !droneData.batteryCapacity || !droneData.state) {
    res.status(404);
    return res.json({ error: 'Drone not found.' });
  }
  if (droneData.batteryCapacity < 25) {
    res.status(403);
    return res.json({ error: 'Low Battery.'});
  }
  if(droneData.state !== 'IDLE') {
    res.status(403);
    return res.json({ error: 'Drone is not available.' })
  }

  // Ensure adding new load will not exceed drone's weight limit
  queryDb('medications', `code = "${data.medCode}"`, 'weight');
  const medToLoad = await queryDb.getOneRow();

  if (!medToLoad || !medToLoad.weight) {
    res.status(404);
    return res.json({ error: 'Medication not found.' });
  }

  queryDb('loadInformation', `droneSerial = "${req.params.droneId}"`, 'medWeight');
  const allLoadedForDrone = await queryDb.getManyRows();

  let sumOfLoadedMeds = 0;
  if (allLoadedForDrone.length >= 1) {
    for (let l = 0; l < allLoadedForDrone.length; l ++) {
      sumOfLoadedMeds += allLoadedForDrone[l].medWeight;
    }
  }
  if ((sumOfLoadedMeds + (medToLoad.weight * data.units)) > droneData.weightLimit) {
    res.status(403);
    return res.json({ error: 'Weight Limit Exceeded.' });
  }

  // Set drone state to LOADING
  queryDb('drones', `serialNumber = "${req.params.droneId}"`, ['state'], ['LOADING']);
  const updateData = await queryDb.updateOneRow();
  
  if (!updateData || !updateData.changes || updateData.changes < 1) {
    res.status(500);
    return res.json({ error: 'Internal Server Error' });
  }

  // Load drone with medication
  const tCols = '"droneSerial", "medCode", "units", "medWeight"';
  const tValues = `"${req.params.droneId}", "${data.medCode}", "${data.units}", "${(medToLoad.weight * data.units)}"`;
  queryDb('loadInformation', tValues, tCols);
  const insertNew = await queryDb.setOneRow();

  if (insertNew.hasOwnProperty('errno')) {
    res.status(500);
    return res.json({ error: insertNew });
  }

  // Chnage drone status to LOADED
  queryDb('drones', `serialNumber = "${req.params.droneId}"`, ['state'], ['LOADED']);
  const updateData2 = await queryDb.updateOneRow();
  
  if (!updateData2 || !updateData2.changes || updateData2.changes < 1) {
    res.status(500);
    return res.json({ error: 'Internal Server Error' });
  }

  data.lastID = insertNew.lastID;
  res.status(201);
  return res.json({ data:
    {
      droneId: req.params.droneId,
      medCode: data.medCode,
      units: data.units,
      medWeight: (medToLoad.weight * data.units)
    }
  });
});

module.exports = router;