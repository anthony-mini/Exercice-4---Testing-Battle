/**
 * Tests End-to-End pour valider des scénarios complets
 */
const request = require('supertest');
const { app } = require('../../../app');

describe('Scénarios E2E', () => {
  describe('Convertir un montant puis calculer la TVA', () => {
    test('Convertir EUR en USD puis calculer la TVA (20%)', async () => {
      // Étape 1 : Convertir 100 EUR en USD
      const conversionResponse = await request(app)
        .get('/convert?from=EUR&to=USD&amount=100')
        .expect(200)
        .expect('Content-Type', /json/);

      // Vérifier le résultat de la conversion
      expect(conversionResponse.body).toEqual({
        from: 'EUR',
        to: 'USD',
        originalAmount: 100,
        convertedAmount: 110 // 100 EUR = 110 USD
      });

      // Récupérer le montant converti
      const montantUSD = conversionResponse.body.convertedAmount;

      // Étape 2 : Calculer la TVA sur le montant en USD
      const tvaResponse = await request(app)
        .get(`/tva?ht=${montantUSD}&taux=20`)
        .expect(200)
        .expect('Content-Type', /json/);

      // Vérifier le résultat du calcul de la TVA
      expect(tvaResponse.body).toEqual({
        ht: 110, // Le montant converti
        taux: 20,
        ttc: 132 // 110 + 20% = 132
      });
    });

    test('Convertir USD en EUR, appliquer une remise puis calculer la TVA', async () => {
      // Étape 1 : Convertir 200 USD en EUR
      const conversionResponse = await request(app)
        .get('/convert?from=USD&to=EUR&amount=200')
        .expect(200)
        .expect('Content-Type', /json/);

      // Vérifier le résultat de la conversion
      const montantEUR = conversionResponse.body.convertedAmount;
      expect(montantEUR).toBeCloseTo(181.82, 0); // 200 USD ≈ 181.82 EUR

      // Étape 2 : Appliquer une remise de 15% sur le montant en EUR
      const remiseResponse = await request(app)
        .get(`/remise?prix=${montantEUR}&pourcentage=15`)
        .expect(200)
        .expect('Content-Type', /json/);

      // Vérifier le résultat de la remise
      const montantApresRemise = remiseResponse.body.prixFinal;
      expect(montantApresRemise).toBeCloseTo(154.55, 0); // 181.82 - 15% ≈ 154.55

      // Étape 3 : Calculer la TVA (5.5%) sur le montant après remise
      const tvaResponse = await request(app)
        .get(`/tva?ht=${montantApresRemise}&taux=5.5`)
        .expect(200)
        .expect('Content-Type', /json/);

      // Vérifier le résultat du calcul de la TVA
      expect(tvaResponse.body.ttc).toBeCloseTo(163.05, 0); // 154.55 + 5.5% ≈ 163.05 (précision à l'unité près)
    });

    test('Scénario avec erreur : conversion suivie d\'un calcul de TVA avec données invalides', async () => {
      // Étape 1 : Convertir 100 EUR en USD
      const conversionResponse = await request(app)
        .get('/convert?from=EUR&to=USD&amount=100')
        .expect(200)
        .expect('Content-Type', /json/);

      // Vérifier le résultat de la conversion
      expect(conversionResponse.body.convertedAmount).toBe(110);

      // Étape 2 : Essayer de calculer la TVA avec un taux négatif (cas d'erreur)
      const tvaResponse = await request(app)
        .get(`/tva?ht=${conversionResponse.body.convertedAmount}&taux=-10`)
        .expect(400)
        .expect('Content-Type', /json/);

      // Vérifier que l'erreur est correctement renvoyée
      expect(tvaResponse.body.error).toBeDefined();
    });

    test('Scénario complet : Convertir, appliquer une remise et calculer la TVA sur le montant final', async () => {
      // Étape 1 : Convertir 350 EUR en GBP
      const conversionResponse = await request(app)
        .get('/convert?from=EUR&to=GBP&amount=350')
        .expect(200)
        .expect('Content-Type', /json/);

      // Le résultat devrait être 350 * (1.1 * 0.8) = 350 * 0.88 = 308 GBP
      expect(conversionResponse.body.convertedAmount).toBe(308);

      // Étape 2 : Appliquer une remise de 25% sur le montant en GBP
      const remiseResponse = await request(app)
        .get(`/remise?prix=${conversionResponse.body.convertedAmount}&pourcentage=25`)
        .expect(200)
        .expect('Content-Type', /json/);

      // Le résultat devrait être 308 * (1 - 25/100) = 308 * 0.75 = 231 GBP
      expect(remiseResponse.body.prixFinal).toBe(231);

      // Étape 3 : Calculer la TVA (20%) sur le montant après remise
      const tvaResponse = await request(app)
        .get(`/tva?ht=${remiseResponse.body.prixFinal}&taux=20`)
        .expect(200)
        .expect('Content-Type', /json/);

      // Le résultat devrait être 231 * (1 + 20/100) = 231 * 1.2 = 277.2 GBP
      expect(tvaResponse.body.ttc).toBe(277.2);
    });
  });
});
