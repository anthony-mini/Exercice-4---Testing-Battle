/**
 * Tests unitaires pour le service de TVA
 */
const { calculerTTC } = require('../../../src/services/tvaService');

describe('Service de TVA', () => {
  describe('calculerTTC()', () => {
    test('devrait calculer correctement le montant TTC avec un taux de 20%', () => {
      const result = calculerTTC(100, 20);
      expect(result).toEqual({
        ht: 100,
        taux: 20,
        ttc: 120 // 100 * (1 + 20/100)
      });
    });

    test('devrait calculer correctement le montant TTC avec un taux de 0%', () => {
      const result = calculerTTC(100, 0);
      expect(result).toEqual({
        ht: 100,
        taux: 0,
        ttc: 100 // 100 * (1 + 0/100)
      });
    });

    test('devrait calculer correctement le montant TTC avec des valeurs décimales', () => {
      const result = calculerTTC(125.5, 5.5);
      expect(result).toEqual({
        ht: 125.5,
        taux: 5.5,
        ttc: 132.4 // 125.5 * (1 + 5.5/100) ≈ 132.4
      });
    });

    test('devrait accepter les montants et taux sous forme de chaînes', () => {
      const result = calculerTTC('100', '20');
      expect(result).toEqual({
        ht: 100,
        taux: 20,
        ttc: 120
      });
    });

    test('devrait lancer une erreur si le montant HT est négatif', () => {
      expect(() => calculerTTC(-100, 20)).toThrow('Le montant HT ne peut pas être négatif');
    });

    test('devrait lancer une erreur si le taux est négatif', () => {
      expect(() => calculerTTC(100, -20)).toThrow('Le taux de TVA ne peut pas être négatif');
    });

    test('devrait lancer une erreur si le montant HT n\'est pas un nombre valide', () => {
      expect(() => calculerTTC('abc', 20)).toThrow('Le montant HT doit être un nombre valide');
    });

    test('devrait lancer une erreur si le taux n\'est pas un nombre valide', () => {
      expect(() => calculerTTC(100, 'abc')).toThrow('Le taux de TVA doit être un nombre valide');
    });
  });
});
