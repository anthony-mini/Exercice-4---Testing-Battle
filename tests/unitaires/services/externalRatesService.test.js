/**
 * Tests unitaires pour le service externe de taux de change
 */
const { getExchangeRate } = require('../../../src/services/externalRatesService');

describe('Service externe de taux de change', () => {
  // Test du cas normal - taux de change existant
  test('devrait retourner le taux de change pour EUR vers USD', async () => {
    const rate = await getExchangeRate('EUR', 'USD');
    expect(rate).toBe(1.1);
  });

  test('devrait retourner le taux de change pour USD vers EUR', async () => {
    const rate = await getExchangeRate('USD', 'EUR');
    expect(rate).toBeCloseTo(1/1.1, 5); // On utilise toBeCloseTo pour éviter les problèmes de précision flottante
  });

  test('devrait retourner le taux de change pour USD vers GBP', async () => {
    const rate = await getExchangeRate('USD', 'GBP');
    expect(rate).toBe(0.8);
  });

  test('devrait retourner le taux de change pour GBP vers USD', async () => {
    const rate = await getExchangeRate('GBP', 'USD');
    expect(rate).toBeCloseTo(1/0.8, 5);
  });

  test('devrait retourner le taux de change pour EUR vers GBP', async () => {
    const rate = await getExchangeRate('EUR', 'GBP');
    expect(rate).toBeCloseTo(1.1 * 0.8, 5);
  });

  test('devrait retourner le taux de change pour GBP vers EUR', async () => {
    const rate = await getExchangeRate('GBP', 'EUR');
    expect(rate).toBeCloseTo(1/(1.1 * 0.8), 5);
  });

  // Test du cas d'erreur - taux de change non disponible
  test('devrait rejeter la promesse si le taux de change n\'est pas disponible', async () => {
    await expect(getExchangeRate('EUR', 'JPY'))
      .rejects
      .toThrow('Taux de change non disponible pour EUR vers JPY');
  });

  // Test du cas d'erreur - paramètres invalides
  test('devrait rejeter la promesse si les devises sont invalides', async () => {
    // Test avec des valeurs nulles
    await expect(getExchangeRate(null, 'USD'))
      .rejects
      .toThrow();
    
    await expect(getExchangeRate('EUR', null))
      .rejects
      .toThrow();
  });
});
