/**
 * Service de calcul de TVA
 * Calcule le montant TTC à partir d'un montant HT et d'un taux de TVA
 */

/**
 * Calcule le montant TTC à partir d'un montant HT et d'un taux de TVA
 * 
 * @param {number} ht - Montant HT
 * @param {number} taux - Taux de TVA (en pourcentage)
 * @returns {Object} Informations sur le calcul (ht, taux, ttc)
 * @throws {Error} Si les paramètres sont invalides
 */
function calculerTTC(ht, taux) {
  // Validation des paramètres
  const parsedHT = parseFloat(ht);
  const parsedTaux = parseFloat(taux);
  
  if (isNaN(parsedHT)) {
    throw new Error('Le montant HT doit être un nombre valide');
  }
  if (isNaN(parsedTaux)) {
    throw new Error('Le taux de TVA doit être un nombre valide');
  }
  
  // Validation des valeurs
  if (parsedHT < 0) {
    throw new Error('Le montant HT ne peut pas être négatif');
  }
  if (parsedTaux < 0) {
    throw new Error('Le taux de TVA ne peut pas être négatif');
  }
  
  // Calcul du montant TTC
  const ttc = parsedHT * (1 + parsedTaux / 100);
  
  // Formatage du résultat à 2 décimales
  const formattedTTC = Math.round(ttc * 100) / 100;
  
  return {
    ht: parsedHT,
    taux: parsedTaux,
    ttc: formattedTTC
  };
}

module.exports = {
  calculerTTC
};
