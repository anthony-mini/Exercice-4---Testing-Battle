/**
 * Tests unitaires pour le service de remise
 */
const { appliquerRemise } = require('../../../src/services/remiseService');

describe('Service de remise', () => {
  describe('appliquerRemise()', () => {
    test('devrait calculer correctement le prix après remise de 10%', () => {
      const result = appliquerRemise(100, 10);
      expect(result).toEqual({
        prixInitial: 100,
        pourcentage: 10,
        prixFinal: 90 // 100 * (1 - 10/100)
      });
    });

    test('devrait calculer correctement le prix avec remise de 0%', () => {
      const result = appliquerRemise(100, 0);
      expect(result).toEqual({
        prixInitial: 100,
        pourcentage: 0,
        prixFinal: 100 // 100 * (1 - 0/100)
      });
    });

    test('devrait calculer correctement le prix avec remise de 100%', () => {
      const result = appliquerRemise(100, 100);
      expect(result).toEqual({
        prixInitial: 100,
        pourcentage: 100,
        prixFinal: 0 // 100 * (1 - 100/100)
      });
    });

    test('devrait calculer correctement le prix avec des valeurs décimales', () => {
      const result = appliquerRemise(199.99, 15.5);
      expect(result).toEqual({
        prixInitial: 199.99,
        pourcentage: 15.5,
        prixFinal: 168.99 // 199.99 * (1 - 15.5/100) ≈ 168.99
      });
    });

    test('devrait accepter les prix et pourcentages sous forme de chaînes', () => {
      const result = appliquerRemise('100', '10');
      expect(result).toEqual({
        prixInitial: 100,
        pourcentage: 10,
        prixFinal: 90
      });
    });

    test('devrait lancer une erreur si le prix est négatif', () => {
      expect(() => appliquerRemise(-100, 10)).toThrow('Le prix ne peut pas être négatif');
    });

    test('devrait lancer une erreur si le pourcentage est négatif', () => {
      expect(() => appliquerRemise(100, -10)).toThrow('Le pourcentage de remise ne peut pas être négatif');
    });

    test('devrait lancer une erreur si le pourcentage est supérieur à 100', () => {
      expect(() => appliquerRemise(100, 110)).toThrow('Le pourcentage de remise ne peut pas dépasser 100%');
    });

    test('devrait lancer une erreur si le prix n\'est pas un nombre valide', () => {
      expect(() => appliquerRemise('abc', 10)).toThrow('Le prix doit être un nombre valide');
    });

    test('devrait lancer une erreur si le pourcentage n\'est pas un nombre valide', () => {
      expect(() => appliquerRemise(100, 'abc')).toThrow('Le pourcentage de remise doit être un nombre valide');
    });
  });
});
