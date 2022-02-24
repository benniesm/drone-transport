const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const { dronesRegisterValidator } = require('../validation/drones');

const queryDb = require('../db/queryDb');

router.get('/', async(req, res) => {
  queryDb('drones');
  const allDrones = await queryDb.getManyRows();
  if (allDrones.hasOwnProperty('errno')) {
    res.status(500);
    return res.json({ error: allDrones });
  }
  res.status(200);
  return res.json({ data: allDrones });
});

router.get('/available', async(req, res) => {
  queryDb('drones', `state = "IDLE"`);
  const allDrones = await queryDb.getManyRows();
  if (allDrones.hasOwnProperty('errno')) {
    res.status(500);
    return res.json({ error: allDrones });
  }
  res.status(200);
  return res.json({ data: allDrones });
});

router.get('/drone/:serial', async(req, res) => {
  queryDb('drones', `serialNumber = "${req.params.serial}"`);
  const oneDrone = await queryDb.getOneRow();
  if (oneDrone && oneDrone.hasOwnProperty('errno')) {
    res.status(500);
    return res.json({ error: oneDrone });
  }
  res.status(200);
  return res.json({ data: oneDrone });
});

router.get('/drone/battery/:serial', async(req, res) => {
  queryDb('drones', `serialNumber = "${req.params.serial}"`, 'batteryCapacity');
  const oneDrone = await queryDb.getOneRow();
  if (oneDrone && oneDrone.hasOwnProperty('errno')) {
    res.status(500);
    return res.json({ error: oneDrone });
  }
  res.status(200);
  return res.json({ data: oneDrone.batteryCapacity + '%' });
});

router.post('/', dronesRegisterValidator, async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const data = req.body;
  let dataKeys = Object.keys(data).join('","');
  let dataValues = Object.values(data).join('","');
  dataKeys = '"' + dataKeys + '"';
  dataValues = '"' + dataValues + '"';

  queryDb('drones', dataValues, dataKeys);
  const insertNew = await queryDb.setOneRow();

  if (insertNew.hasOwnProperty('errno')) {
    res.status(500);
    return res.json({ error: insertNew });
  }
  data.lastID = insertNew.lastID;
  res.status(201);
  return res.json({ data: data });
});

module.exports = router;