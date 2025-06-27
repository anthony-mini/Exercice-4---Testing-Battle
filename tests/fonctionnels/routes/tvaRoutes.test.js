/**
 * Tests fonctionnels pour les routes de calcul de TVA
 */
const request = require('supertest');
const { app } = require('../../../app');

describe('Routes de calcul de TVA', () => {
  describe('GET /tva', () => {
    test('devrait calculer correctement le montant TTC avec un taux de 20%', async () => {
      const response = await request(app)
        .get('/tva?ht=100&taux=20')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({
        ht: 100,
        taux: 20,
        ttc: 120
      });
    });

    test('devrait calculer correctement le montant TTC avec un taux de 0%', async () => {
      const response = await request(app)
        .get('/tva?ht=100&taux=0')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({
        ht: 100,
        taux: 0,
        ttc: 100
      });
    });

    test('devrait calculer correctement le montant TTC avec des valeurs décimales', async () => {
      const response = await request(app)
        .get('/tva?ht=125.5&taux=5.5')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({
        ht: 125.5,
        taux: 5.5,
        ttc: 132.4
      });
    });

    test('devrait renvoyer une erreur 400 si le montant HT est manquant', async () => {
      const response = await request(app)
        .get('/tva?taux=20')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });

    test('devrait renvoyer une erreur 400 si le taux est manquant', async () => {
      const response = await request(app)
        .get('/tva?ht=100')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });

    test('devrait renvoyer une erreur 400 si le montant HT est négatif', async () => {
      const response = await request(app)
        .get('/tva?ht=-100&taux=20')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });

    test('devrait renvoyer une erreur 400 si le taux est négatif', async () => {
      const response = await request(app)
        .get('/tva?ht=100&taux=-20')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });

    test('devrait renvoyer une erreur 400 si le montant HT n\'est pas un nombre', async () => {
      const response = await request(app)
        .get('/tva?ht=abc&taux=20')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });

    test('devrait renvoyer une erreur 400 si le taux n\'est pas un nombre', async () => {
      const response = await request(app)
        .get('/tva?ht=100&taux=abc')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });
  });
});
