/**
 * Tests unitaires pour le contrôleur de calcul de TVA
 */
const { calculateTVA } = require('../../../src/controllers/tvaController');
const tvaService = require('../../../src/services/tvaService');

// Mock du service de TVA
jest.mock('../../../src/services/tvaService');

describe('Contrôleur de calcul de TVA', () => {
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
  
  test('devrait calculer le montant TTC correctement', () => {
    // Arrange
    req.query = { ht: '100', taux: '20' };
    tvaService.calculerTTC.mockReturnValue({
      ht: 100,
      taux: 20,
      ttc: 120
    });

    // Act
    calculateTVA(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      ht: 100,
      taux: 20,
      ttc: 120
    });
  });

  test('devrait gérer le cas où les paramètres sont manquants', () => {
    // Arrange
    req.query = {}; // Pas de paramètres

    // Act
    calculateTVA(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Paramètres manquants. Les paramètres ht et taux sont requis.'
    });
    expect(tvaService.calculerTTC).not.toHaveBeenCalled();
  });

  test('devrait gérer l\'erreur quand le montant HT est négatif', () => {
    // Arrange
    req.query = { ht: '-100', taux: '20' };
    tvaService.calculerTTC.mockImplementation(() => {
      throw new Error('Le montant HT ne peut pas être négatif');
    });

    // Act
    calculateTVA(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Le montant HT ne peut pas être négatif' });
  });

  test('devrait gérer l\'erreur quand le taux est négatif', () => {
    // Arrange
    req.query = { ht: '100', taux: '-20' };
    tvaService.calculerTTC.mockImplementation(() => {
      throw new Error('Le taux de TVA ne peut pas être négatif');
    });

    // Act
    calculateTVA(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Le taux de TVA ne peut pas être négatif' });
  });

  test('devrait gérer l\'erreur quand les valeurs ne sont pas des nombres', () => {
    // Arrange
    req.query = { ht: 'abc', taux: '20' };
    tvaService.calculerTTC.mockImplementation(() => {
      throw new Error('Le montant HT doit être un nombre valide');
    });

    // Act
    calculateTVA(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Le montant HT doit être un nombre valide' });
  });

  test('devrait gérer les erreurs inconnues avec un statut 500', () => {
    // Arrange
    req.query = { ht: '100', taux: '20' };
    tvaService.calculerTTC.mockImplementation(() => {
      throw new Error('Erreur inattendue');
    });
    
    // Espionner console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    calculateTVA(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors du calcul de TVA' });
    expect(consoleSpy).toHaveBeenCalled();
    
    // Restaurer console.error
    consoleSpy.mockRestore();
  });
});
