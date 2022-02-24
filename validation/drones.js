const { body } = require('express-validator');

const dronesRegisterValidator = [
  body('serialNumber').exists().withMessage({ serialNumber: 'Field is required.' }),
  body('model').exists().withMessage({ model: 'Field is required.' }),
  body('weightLimit').isInt().withMessage({ weightLimit: 'Field must be a number.' }),
  body('batteryCapacity').isInt().withMessage({ batteryCapacity: 'Field must be a number.' }),
  body('state').exists().withMessage({ state: 'Field is required.' })
];

module.exports = {
  dronesRegisterValidator
};