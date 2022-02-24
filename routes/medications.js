const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const { medicationsAddValidator } = require('../validation/medication');

const queryDb = require('../db/queryDb');

router.get('/', async(req, res) => {
  queryDb('medications');
  const allMeds = await queryDb.getManyRows();
  if (allMeds.hasOwnProperty('errno')) {
    res.status(500);
    return res.json({ error: allMeds });
  }
  res.status(200);
  return res.json({ data: allMeds });
});

router.get('/:code', async(req, res) => {
  queryDb('medications', `code = "${req.params.code}"`);
  const oneMed = await queryDb.getOneRow();
  if (oneMed && oneMed.hasOwnProperty('errno')) {
    res.status(500);
    return res.json({ error: oneMed });
  }
  res.status(200);
  return res.json({ data: oneMed });
});

router.post('/', medicationsAddValidator, async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const data = req.body;
  let dataKeys = Object.keys(data).join('","');
  let dataValues = Object.values(data).join('","');
  dataKeys = '"' + dataKeys + '"';
  dataValues = '"' + dataValues + '"';

  queryDb('medications', dataValues, dataKeys);
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