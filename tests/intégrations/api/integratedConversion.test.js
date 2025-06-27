/**
 * Tests d'intégration pour le service de conversion intégré
 * qui utilise un service externe pour récupérer les taux de change
 */
const { convertWithExternalRates } = require('../../../src/services/integratedConversionService');
const externalRatesService = require('../../../src/services/externalRatesService');

// Mock du service externe des taux de change
jest.mock('../../../src/services/externalRatesService');

describe('Service de conversion intégré', () => {
  describe('convertWithExternalRates()', () => {
    // Restaurer les mocks avant chaque test
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test('devrait appeler le service externe et convertir correctement EUR en USD', async () => {
      // Configurer le mock pour renvoyer un taux spécifique
      externalRatesService.getExchangeRate.mockResolvedValue(1.1);

      const result = await convertWithExternalRates('EUR', 'USD', 100);

      // Vérifier que le service externe a été appelé avec les bons paramètres
      expect(externalRatesService.getExchangeRate).toHaveBeenCalledWith('EUR', 'USD');
      
      // Vérifier le résultat
      expect(result).toEqual({
        from: 'EUR',
        to: 'USD',
        originalAmount: 100,
        convertedAmount: 110
      });
    });

    test('devrait appeler le service externe et convertir correctement USD en GBP', async () => {
      // Configurer le mock pour renvoyer un taux spécifique
      externalRatesService.getExchangeRate.mockResolvedValue(0.8);

      const result = await convertWithExternalRates('USD', 'GBP', 100);

      // Vérifier que le service externe a été appelé avec les bons paramètres
      expect(externalRatesService.getExchangeRate).toHaveBeenCalledWith('USD', 'GBP');
      
      // Vérifier le résultat
      expect(result).toEqual({
        from: 'USD',
        to: 'GBP',
        originalAmount: 100,
        convertedAmount: 80
      });
    });

    test('devrait propager l\'erreur si le service externe échoue', async () => {
      // Configurer le mock pour simuler une erreur
      externalRatesService.getExchangeRate.mockRejectedValue(new Error('Erreur API externe'));

      // Vérifier que l'erreur est propagée correctement
      await expect(convertWithExternalRates('EUR', 'USD', 100)).rejects.toThrow('Erreur lors de la conversion');
      
      // Vérifier que le service externe a été appelé avec les bons paramètres
      expect(externalRatesService.getExchangeRate).toHaveBeenCalledWith('EUR', 'USD');
    });

    test('ne devrait pas appeler le service externe si les devises sont identiques', async () => {
      const result = await convertWithExternalRates('EUR', 'EUR', 100);

      // Vérifier que le service externe n'a pas été appelé
      expect(externalRatesService.getExchangeRate).not.toHaveBeenCalled();
      
      // Vérifier le résultat
      expect(result).toEqual({
        from: 'EUR',
        to: 'EUR',
        originalAmount: 100,
        convertedAmount: 100
      });
    });

    // Tests pour les cas d'erreur
    test('devrait lancer une erreur si la devise source est invalide', async () => {
      await expect(convertWithExternalRates('XXX', 'USD', 100)).rejects.toThrow('Devise source non supportée');
      expect(externalRatesService.getExchangeRate).not.toHaveBeenCalled();
    });

    test('devrait lancer une erreur si la devise cible est invalide', async () => {
      await expect(convertWithExternalRates('EUR', 'XXX', 100)).rejects.toThrow('Devise cible non supportée');
      expect(externalRatesService.getExchangeRate).not.toHaveBeenCalled();
    });

    test('devrait lancer une erreur si le montant est négatif', async () => {
      await expect(convertWithExternalRates('EUR', 'USD', -100)).rejects.toThrow('Le montant ne peut pas être négatif');
      expect(externalRatesService.getExchangeRate).not.toHaveBeenCalled();
    });
  });
});
