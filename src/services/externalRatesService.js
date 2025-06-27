/**
 * Service externe fictif pour récupérer les taux de change
 * Dans un cas réel, ce service ferait appel à une API externe
 * Pour l'exercice, nous utilisons des taux fixes
 */

/**
 * Récupère le taux de change entre deux devises
 * @param {string} from - Devise d'origine
 * @param {string} to - Devise de destination
 * @returns {Promise<number>} Taux de change
 */
async function getExchangeRate(from, to) {
  // En situation réelle, on ferait un appel à une API externe
  // Pour l'exercice, nous simulons un appel asynchrone
  return new Promise((resolve, reject) => {
    // Délai artificiel pour simuler l'appel réseau
    setTimeout(() => {
      try {
        const rates = {
          'EUR_USD': 1.1,
          'USD_EUR': 1/1.1,
          'USD_GBP': 0.8,
          'GBP_USD': 1/0.8,
          'EUR_GBP': 1.1 * 0.8,
          'GBP_EUR': 1/(1.1 * 0.8)
        };
        
        const key = `${from}_${to}`;
        
        if (!rates[key]) {
          return reject(new Error(`Taux de change non disponible pour ${from} vers ${to}`));
        }
        
        resolve(rates[key]);
      } catch (error) {
        reject(new Error('Erreur lors de la récupération du taux de change'));
      }
    }, 100); // Délai artificiel
  });
}

module.exports = {
  getExchangeRate
};
