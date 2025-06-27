/**
 * Contrôleur pour les opérations de conversion de devises
 */
const { convert } = require('../services/conversionService');

/**
 * Convertit un montant d'une devise à une autre
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 */
function convertCurrency(req, res) {
  try {
    const { from, to, amount } = req.query;
    
    // Vérification des paramètres obligatoires
    if (!from || !to || amount === undefined) {
      return res.status(400).json({ 
        error: 'Paramètres manquants. Les paramètres from, to et amount sont requis.' 
      });
    }
    
    // Appel du service de conversion
    const result = convert(from, to, amount);
    
    // Envoi du résultat
    res.status(200).json(result);
  } catch (error) {
    // Gestion des erreurs spécifiques
    if (error.message.includes('non supportée') || 
        error.message.includes('Le montant ne peut pas être négatif') ||
        error.message.includes('doit être un nombre valide')) {
      return res.status(400).json({ error: error.message });
    }
    
    // Erreur serveur par défaut
    console.error('Erreur de conversion:', error);
    res.status(500).json({ error: 'Erreur lors de la conversion' });
  }
}

module.exports = {
  convertCurrency
};
