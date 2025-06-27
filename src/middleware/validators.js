/**
 * Middleware de validation des requêtes
 * Utilise express-validator pour valider les entrées
 */
const { query, validationResult } = require('express-validator');

/**
 * Fonction utilitaire pour traiter les résultats de validation
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 * @param {Function} next - Fonction next d'Express
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Erreur de validation',
      details: errors.array() 
    });
  }
  next();
};

/**
 * Validateur pour la route de conversion
 */
const validateConversion = [
  query('from')
    .exists().withMessage('La devise source (from) est requise')
    .notEmpty().withMessage('La devise source (from) est requise')
    .isString().withMessage('La devise source doit être une chaîne de caractères')
    .isLength({ min: 3, max: 3 }).withMessage('La devise doit être au format ISO (3 caractères)')
    .customSanitizer(value => value && value.toUpperCase())
    .isIn(['EUR', 'USD', 'GBP']).withMessage('Devise non supportée. Devises supportées : EUR, USD, GBP'),
  
  query('to')
    .exists().withMessage('La devise cible (to) est requise')
    .notEmpty().withMessage('La devise cible (to) est requise')
    .isString().withMessage('La devise cible doit être une chaîne de caractères')
    .isLength({ min: 3, max: 3 }).withMessage('La devise doit être au format ISO (3 caractères)')
    .customSanitizer(value => value && value.toUpperCase())
    .isIn(['EUR', 'USD', 'GBP']).withMessage('Devise non supportée. Devises supportées : EUR, USD, GBP'),
  
  query('amount')
    .exists().withMessage('Le montant (amount) est requis')
    .notEmpty().withMessage('Le montant (amount) est requis')
    .isFloat({ min: 0 }).withMessage('Le montant doit être un nombre positif'),
  
  handleValidationErrors
];

/**
 * Validateur pour la route de calcul de TVA
 */
const validateTVA = [
  query('ht')
    .notEmpty().withMessage('Le montant HT est requis')
    .isFloat({ min: 0 }).withMessage('Le montant HT doit être un nombre positif'),
  
  query('taux')
    .notEmpty().withMessage('Le taux de TVA est requis')
    .isFloat({ min: 0 }).withMessage('Le taux de TVA doit être un nombre positif'),
  
  handleValidationErrors
];

/**
 * Validateur pour la route de calcul de remise
 */
const validateRemise = [
  query('prix')
    .notEmpty().withMessage('Le prix est requis')
    .isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  
  query('pourcentage')
    .notEmpty().withMessage('Le pourcentage de remise est requis')
    .isFloat({ min: 0, max: 100 }).withMessage('Le pourcentage de remise doit être un nombre entre 0 et 100'),
  
  handleValidationErrors
];

module.exports = {
  validateConversion,
  validateTVA,
  validateRemise
};
