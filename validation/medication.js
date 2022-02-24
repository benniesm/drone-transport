const { body } = require('express-validator');

const medicationsAddValidator = [
  body('code').exists().withMessage({ code: 'Field is required.' }),
  body('name').exists().withMessage({ name: 'Field is required.' }),
  body('weight').isInt().withMessage({ weight: 'Field must be a number.' }),
  body('imageUrl').exists().withMessage({ imageUrl: 'Field is required.' })
];

module.exports = {
  medicationsAddValidator
};