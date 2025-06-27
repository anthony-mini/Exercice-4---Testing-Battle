/**
 * Tests unitaires pour le service de conversion
 */
const { convert, CONVERSION_RATES } = require('../../../src/services/conversionService');

describe('Service de conversion', () => {
  describe('convert()', () => {
    test('devrait convertir correctement EUR en USD', () => {
      const result = convert('EUR', 'USD', 100);
      expect(result).toEqual({
        from: 'EUR',
        to: 'USD',
        originalAmount: 100,
        convertedAmount: 110 // 100 * 1.1
      });
    });

    test('devrait convertir correctement USD en EUR', () => {
      const result = convert('USD', 'EUR', 110);
      expect(result).toEqual({
        from: 'USD',
        to: 'EUR',
        originalAmount: 110,
        convertedAmount: 100 // 110 / 1.1
      });
    });

    test('devrait convertir correctement USD en GBP', () => {
      const result = convert('USD', 'GBP', 100);
      expect(result).toEqual({
        from: 'USD',
        to: 'GBP',
        originalAmount: 100,
        convertedAmount: 80 // 100 * 0.8
      });
    });

    test('devrait convertir correctement GBP en USD', () => {
      const result = convert('GBP', 'USD', 80);
      expect(result).toEqual({
        from: 'GBP',
        to: 'USD',
        originalAmount: 80,
        convertedAmount: 100 // 80 / 0.8
      });
    });

    test('devrait convertir correctement EUR en GBP', () => {
      const result = convert('EUR', 'GBP', 100);
      expect(result).toEqual({
        from: 'EUR',
        to: 'GBP',
        originalAmount: 100,
        convertedAmount: 88 // 100 * 1.1 * 0.8
      });
    });

    test('devrait retourner le même montant si les devises sont identiques', () => {
      const result = convert('EUR', 'EUR', 100);
      expect(result).toEqual({
        from: 'EUR',
        to: 'EUR',
        originalAmount: 100,
        convertedAmount: 100
      });
    });

    test('devrait accepter les devises en minuscules', () => {
      const result = convert('eur', 'usd', 100);
      expect(result).toEqual({
        from: 'EUR',
        to: 'USD',
        originalAmount: 100,
        convertedAmount: 110
      });
    });

    test('devrait lancer une erreur si la devise source est invalide', () => {
      expect(() => convert('XXX', 'USD', 100)).toThrow('Devise source non supportée');
    });

    test('devrait lancer une erreur si la devise cible est invalide', () => {
      expect(() => convert('EUR', 'XXX', 100)).toThrow('Devise cible non supportée');
    });

    test('devrait lancer une erreur si le montant est négatif', () => {
      expect(() => convert('EUR', 'USD', -100)).toThrow('Le montant ne peut pas être négatif');
    });

    test('devrait lancer une erreur si le montant n\'est pas un nombre valide', () => {
      expect(() => convert('EUR', 'USD', 'abc')).toThrow('Le montant doit être un nombre valide');
    });

    test('devrait lancer une erreur si la devise source est manquante', () => {
      expect(() => convert(null, 'USD', 100)).toThrow('Les devises source et destination sont requises');
    });

    test('devrait lancer une erreur si la devise cible est manquante', () => {
      expect(() => convert('EUR', null, 100)).toThrow('Les devises source et destination sont requises');
    });
  });

  describe('CONVERSION_RATES', () => {
    test('devrait contenir les taux de conversion corrects', () => {
      expect(CONVERSION_RATES['EUR_USD']).toBe(1.1);
      expect(CONVERSION_RATES['USD_GBP']).toBe(0.8);
      expect(CONVERSION_RATES['EUR_GBP']).toBe(0.88);
    });
  });
});
