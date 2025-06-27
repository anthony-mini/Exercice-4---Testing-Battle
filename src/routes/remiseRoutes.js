/**
 * Routes pour les calculs de remise
 */
const express = require('express');
const { applyDiscount } = require('../controllers/remiseController');
const { validateRemise } = require('../middleware/validators');

const router = express.Router();

// Route GET /remise?prix=100&pourcentage=10
router.get('/remise', validateRemise, applyDiscount);

module.exports = router;
