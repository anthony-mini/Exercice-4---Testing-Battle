/**
 * Routes pour les conversions de devises
 */
const express = require('express');
const { convertCurrency } = require('../controllers/conversionController');
const { validateConversion } = require('../middleware/validators');

const router = express.Router();

// Route GET /convert?from=EUR&to=USD&amount=100
router.get('/convert', validateConversion, convertCurrency);

module.exports = router;
