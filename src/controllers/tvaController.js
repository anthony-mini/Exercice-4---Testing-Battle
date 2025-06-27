/**
 * Contrôleur pour les calculs de TVA
 */
const { calculerTTC } = require('../services/tvaService');

/**
 * Calcule le montant TTC à partir d'un montant HT et d'un taux de TVA
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 */
function calculateTVA(req, res) {
  try {
    const { ht, taux } = req.query;
    
    // Vérification des paramètres obligatoires
    if (ht === undefined || taux === undefined) {
      return res.status(400).json({ 
        error: 'Paramètres manquants. Les paramètres ht et taux sont requis.' 
      });
    }
    
    // Appel du service de calcul TVA
    const result = calculerTTC(ht, taux);
    
    // Envoi du résultat
    res.status(200).json(result);
  } catch (error) {
    // Gestion des erreurs spécifiques
    if (error.message.includes('ne peut pas être négatif') || 
        error.message.includes('doit être un nombre valide')) {
      return res.status(400).json({ error: error.message });
    }
    
    // Erreur serveur par défaut
    console.error('Erreur de calcul TVA:', error);
    res.status(500).json({ error: 'Erreur lors du calcul de TVA' });
  }
}

module.exports = {
  calculateTVA
};
