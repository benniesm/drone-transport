const { body } = require('express-validator');

const loaderAddValidator = [
  body('medCode').exists().withMessage({ medCode: 'Field is required.' }),
  body('units').isInt().withMessage({ units: 'Field must be a number.' })
];

module.exports = {
  loaderAddValidator
};