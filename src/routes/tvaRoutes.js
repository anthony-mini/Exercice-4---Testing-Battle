/**
 * Routes pour les calculs de TVA
 */
const express = require('express');
const { calculateTVA } = require('../controllers/tvaController');
const { validateTVA } = require('../middleware/validators');

const router = express.Router();

// Route GET /tva?ht=100&taux=20
router.get('/tva', validateTVA, calculateTVA);

module.exports = router;
