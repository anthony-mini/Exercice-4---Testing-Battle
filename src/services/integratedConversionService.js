/**
 * Service de conversion intégré qui utilise le service externe
 * pour récupérer les taux de change
 */
const { getExchangeRate } = require('./externalRatesService');

/**
 * Convertit un montant en utilisant le service externe de taux de change
 * @param {string} from - Devise d'origine
 * @param {string} to - Devise cible
 * @param {number} amount - Montant à convertir
 * @returns {Promise<Object>} Résultat de la conversion
 */
async function convertWithExternalRates(from, to, amount) {
  // Validation des paramètres
  if (!from || !to) {
    throw new Error('Les devises source et destination sont requises');
  }
  
  from = from.toUpperCase();
  to = to.toUpperCase();
  
  // Validation des devises
  const supportedCurrencies = ['EUR', 'USD', 'GBP'];
  if (!supportedCurrencies.includes(from)) {
    throw new Error(`Devise source non supportée: ${from}`);
  }
  if (!supportedCurrencies.includes(to)) {
    throw new Error(`Devise cible non supportée: ${to}`);
  }
  
  // Validation du montant
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount)) {
    throw new Error('Le montant doit être un nombre valide');
  }
  if (parsedAmount < 0) {
    throw new Error('Le montant ne peut pas être négatif');
  }
  
  // Si même devise, on retourne le même montant
  if (from === to) {
    return {
      from,
      to,
      originalAmount: parsedAmount,
      convertedAmount: parsedAmount
    };
  }
  
  try {
    // Récupération du taux de change via le service externe
    const rate = await getExchangeRate(from, to);
    
    // Calcul de la conversion
    const convertedAmount = parsedAmount * rate;
    
    // Formatage du résultat à 2 décimales
    const formattedConvertedAmount = Math.round(convertedAmount * 100) / 100;
    
    return {
      from,
      to,
      originalAmount: parsedAmount,
      convertedAmount: formattedConvertedAmount
    };
  } catch (error) {
    throw new Error(`Erreur lors de la conversion: ${error.message}`);
  }
}

module.exports = {
  convertWithExternalRates
};
