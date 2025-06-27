/**
 * Service de calcul de remise
 * Applique une remise (pourcentage) sur un prix donné
 */

/**
 * Applique une remise sur un prix donné
 * 
 * @param {number} prix - Prix initial
 * @param {number} pourcentage - Pourcentage de remise
 * @returns {Object} Informations sur le calcul (prixInitial, pourcentage, prixFinal)
 * @throws {Error} Si les paramètres sont invalides
 */
function appliquerRemise(prix, pourcentage) {
  // Validation des paramètres
  const parsedPrix = parseFloat(prix);
  const parsedPourcentage = parseFloat(pourcentage);
  
  if (isNaN(parsedPrix)) {
    throw new Error('Le prix doit être un nombre valide');
  }
  if (isNaN(parsedPourcentage)) {
    throw new Error('Le pourcentage de remise doit être un nombre valide');
  }
  
  // Validation des valeurs
  if (parsedPrix < 0) {
    throw new Error('Le prix ne peut pas être négatif');
  }
  if (parsedPourcentage < 0) {
    throw new Error('Le pourcentage de remise ne peut pas être négatif');
  }
  if (parsedPourcentage > 100) {
    throw new Error('Le pourcentage de remise ne peut pas dépasser 100%');
  }
  
  // Calcul du prix après remise
  const prixFinal = parsedPrix * (1 - parsedPourcentage / 100);
  
  // Formatage du résultat à 2 décimales
  const formattedPrixFinal = Math.round(prixFinal * 100) / 100;
  
  return {
    prixInitial: parsedPrix,
    pourcentage: parsedPourcentage,
    prixFinal: formattedPrixFinal
  };
}

module.exports = {
  appliquerRemise
};
