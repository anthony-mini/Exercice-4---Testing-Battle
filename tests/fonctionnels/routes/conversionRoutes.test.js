/**
 * Tests fonctionnels pour les routes de conversion
 */
const request = require('supertest');
const { app } = require('../../../app');

describe('Routes de conversion', () => {
  describe('GET /convert', () => {
    test('devrait convertir correctement EUR en USD', async () => {
      const response = await request(app)
        .get('/convert?from=EUR&to=USD&amount=100')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({
        from: 'EUR',
        to: 'USD',
        originalAmount: 100,
        convertedAmount: 110
      });
    });

    test('devrait convertir correctement USD en EUR', async () => {
      const response = await request(app)
        .get('/convert?from=USD&to=EUR&amount=110')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({
        from: 'USD',
        to: 'EUR',
        originalAmount: 110,
        convertedAmount: 100
      });
    });

    test('devrait accepter les devises en minuscules', async () => {
      const response = await request(app)
        .get('/convert?from=eur&to=usd&amount=100')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({
        from: 'EUR',
        to: 'USD',
        originalAmount: 100,
        convertedAmount: 110
      });
    });

    test('devrait renvoyer une erreur 400 si la devise source est manquante', async () => {
      const response = await request(app)
        .get('/convert?to=USD&amount=100')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });

    test('devrait renvoyer une erreur 400 si le montant est manquant', async () => {
      const response = await request(app)
        .get('/convert?from=EUR&to=USD')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });

    test('devrait renvoyer une erreur 400 si la devise source est invalide', async () => {
      const response = await request(app)
        .get('/convert?from=XXX&to=USD&amount=100')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });

    test('devrait renvoyer une erreur 400 si la devise cible est invalide', async () => {
      const response = await request(app)
        .get('/convert?from=EUR&to=XXX&amount=100')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });

    test('devrait renvoyer une erreur 400 si le montant est négatif', async () => {
      const response = await request(app)
        .get('/convert?from=EUR&to=USD&amount=-100')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });

    test('devrait renvoyer une erreur 400 si le montant n\'est pas un nombre', async () => {
      const response = await request(app)
        .get('/convert?from=EUR&to=USD&amount=abc')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });
  });
});
