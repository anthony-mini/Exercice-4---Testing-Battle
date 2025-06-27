/**
 * Tests unitaires pour le contrôleur de conversion
 */
const { convertCurrency } = require('../../../src/controllers/conversionController');
const conversionService = require('../../../src/services/conversionService');

// Mock du service de conversion
jest.mock('../../../src/services/conversionService');

describe('Contrôleur de conversion', () => {
  let req, res;

  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();

    // Mock des objets req et res
    req = {
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('devrait gérer l\'erreur quand la devise n\'est pas supportée', () => {
    // Arrange
    req.query = { from: 'EUR', to: 'USD', amount: '100' };
    conversionService.convert.mockImplementation(() => {
      throw new Error('Devise non supportée');
    });

    // Act
    convertCurrency(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Devise non supportée' });
  });

  test('devrait gérer l\'erreur quand le montant est négatif', () => {
    // Arrange
    req.query = { from: 'EUR', to: 'USD', amount: '-10' };
    conversionService.convert.mockImplementation(() => {
      throw new Error('Le montant ne peut pas être négatif');
    });

    // Act
    convertCurrency(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Le montant ne peut pas être négatif' });
  });

  test('devrait gérer l\'erreur quand le montant n\'est pas un nombre valide', () => {
    // Arrange
    req.query = { from: 'EUR', to: 'USD', amount: 'abc' };
    conversionService.convert.mockImplementation(() => {
      throw new Error('Le montant doit être un nombre valide');
    });

    // Act
    convertCurrency(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Le montant doit être un nombre valide' });
  });

  test('devrait gérer les erreurs inconnues avec un statut 500', () => {
    // Arrange
    req.query = { from: 'EUR', to: 'USD', amount: '100' };
    conversionService.convert.mockImplementation(() => {
      throw new Error('Erreur inattendue');
    });
    
    // Espionner console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    convertCurrency(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors de la conversion' });
    expect(consoleSpy).toHaveBeenCalled();
    
    // Restaurer console.error
    consoleSpy.mockRestore();
  });
});
