/**
 * Contrôleur pour les calculs de remise
 */
const { appliquerRemise } = require('../services/remiseService');

/**
 * Applique une remise sur un prix
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 */
function applyDiscount(req, res) {
  try {
    const { prix, pourcentage } = req.query;
    
    // Vérification des paramètres obligatoires
    if (prix === undefined || pourcentage === undefined) {
      return res.status(400).json({ 
        error: 'Paramètres manquants. Les paramètres prix et pourcentage sont requis.' 
      });
    }
    
    // Appel du service de calcul de remise
    const result = appliquerRemise(prix, pourcentage);
    
    // Envoi du résultat
    res.status(200).json(result);
  } catch (error) {
    // Gestion des erreurs spécifiques
    if (error.message.includes('ne peut pas être négatif') || 
        error.message.includes('doit être un nombre valide') ||
        error.message.includes('ne peut pas dépasser 100%')) {
      return res.status(400).json({ error: error.message });
    }
    
    // Erreur serveur par défaut
    console.error('Erreur de calcul de remise:', error);
    res.status(500).json({ error: 'Erreur lors du calcul de la remise' });
  }
}

module.exports = {
  applyDiscount
};
