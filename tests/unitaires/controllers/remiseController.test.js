/**
 * Tests unitaires pour le contrôleur de calcul de remise
 */
const { applyDiscount } = require('../../../src/controllers/remiseController');
const remiseService = require('../../../src/services/remiseService');

// Mock du service de remise
jest.mock('../../../src/services/remiseService');

describe('Contrôleur de calcul de remise', () => {
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
  
  // Test du cas normal (aucun test pour ce cas n'était défini)
  test('devrait calculer la remise correctement', () => {
    // Arrange
    req.query = { prix: '100', pourcentage: '10' };
    
    // Configurer le mock pour ce test
    remiseService.appliquerRemise.mockImplementation(() => ({
      prix: 100,
      pourcentage: 10,
      prixRemise: 90
    }));
    
    // Act
    applyDiscount(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      prix: 100,
      pourcentage: 10,
      prixRemise: 90
    });
  });

  test('devrait gérer le cas où les paramètres sont manquants', () => {
    // Arrange
    req.query = {}; // Pas de paramètres

    // Act
    applyDiscount(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Paramètres manquants. Les paramètres prix et pourcentage sont requis.'
    });
    expect(remiseService.appliquerRemise).not.toHaveBeenCalled();
  });

  test('devrait gérer l\'erreur quand le prix est négatif', () => {
    // Arrange
    req.query = { prix: '-100', pourcentage: '10' };
    remiseService.appliquerRemise.mockImplementation(() => {
      throw new Error('Le prix ne peut pas être négatif');
    });

    // Act
    applyDiscount(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Le prix ne peut pas être négatif' });
  });

  test('devrait gérer l\'erreur quand le pourcentage de remise est négatif', () => {
    // Arrange
    req.query = { prix: '100', pourcentage: '-10' };
    remiseService.appliquerRemise.mockImplementation(() => {
      throw new Error('Le pourcentage de remise ne peut pas être négatif');
    });

    // Act
    applyDiscount(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Le pourcentage de remise ne peut pas être négatif' });
  });

  test('devrait gérer l\'erreur quand le pourcentage de remise dépasse 100%', () => {
    // Arrange
    req.query = { prix: '100', pourcentage: '110' };
    remiseService.appliquerRemise.mockImplementation(() => {
      throw new Error('Le pourcentage de remise ne peut pas dépasser 100%');
    });

    // Act
    applyDiscount(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Le pourcentage de remise ne peut pas dépasser 100%' });
  });

  test('devrait gérer l\'erreur quand les valeurs ne sont pas des nombres', () => {
    // Arrange
    req.query = { prix: 'abc', pourcentage: '10' };
    remiseService.appliquerRemise.mockImplementation(() => {
      throw new Error('Le prix doit être un nombre valide');
    });

    // Act
    applyDiscount(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Le prix doit être un nombre valide' });
  });

  test('devrait gérer les erreurs inconnues avec un statut 500', () => {
    // Arrange
    req.query = { prix: '100', pourcentage: '10' };
    remiseService.appliquerRemise.mockImplementation(() => {
      throw new Error('Erreur inattendue');
    });
    
    // Espionner console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    applyDiscount(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors du calcul de la remise' });
    expect(consoleSpy).toHaveBeenCalled();
    
    // Restaurer console.error
    consoleSpy.mockRestore();
  });
});
