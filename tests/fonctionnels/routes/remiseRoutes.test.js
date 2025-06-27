/**
 * Tests fonctionnels pour les routes de calcul de remise
 */
const request = require('supertest');
const { app } = require('../../../app');

describe('Routes de calcul de remise', () => {
  describe('GET /remise', () => {
    test('devrait calculer correctement le prix après remise de 10%', async () => {
      const response = await request(app)
        .get('/remise?prix=100&pourcentage=10')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({
        prixInitial: 100,
        pourcentage: 10,
        prixFinal: 90
      });
    });

    test('devrait calculer correctement le prix avec remise de 0%', async () => {
      const response = await request(app)
        .get('/remise?prix=100&pourcentage=0')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({
        prixInitial: 100,
        pourcentage: 0,
        prixFinal: 100
      });
    });

    test('devrait calculer correctement le prix avec remise de 100%', async () => {
      const response = await request(app)
        .get('/remise?prix=100&pourcentage=100')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({
        prixInitial: 100,
        pourcentage: 100,
        prixFinal: 0
      });
    });

    test('devrait calculer correctement le prix avec des valeurs décimales', async () => {
      const response = await request(app)
        .get('/remise?prix=199.99&pourcentage=15.5')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({
        prixInitial: 199.99,
        pourcentage: 15.5,
        prixFinal: 168.99
      });
    });

    test('devrait renvoyer une erreur 400 si le prix est manquant', async () => {
      const response = await request(app)
        .get('/remise?pourcentage=10')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });

    test('devrait renvoyer une erreur 400 si le pourcentage est manquant', async () => {
      const response = await request(app)
        .get('/remise?prix=100')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });

    test('devrait renvoyer une erreur 400 si le prix est négatif', async () => {
      const response = await request(app)
        .get('/remise?prix=-100&pourcentage=10')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });

    test('devrait renvoyer une erreur 400 si le pourcentage est négatif', async () => {
      const response = await request(app)
        .get('/remise?prix=100&pourcentage=-10')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });

    test('devrait renvoyer une erreur 400 si le pourcentage est supérieur à 100', async () => {
      const response = await request(app)
        .get('/remise?prix=100&pourcentage=110')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });

    test('devrait renvoyer une erreur 400 si le prix n\'est pas un nombre', async () => {
      const response = await request(app)
        .get('/remise?prix=abc&pourcentage=10')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });

    test('devrait renvoyer une erreur 400 si le pourcentage n\'est pas un nombre', async () => {
      const response = await request(app)
        .get('/remise?prix=100&pourcentage=abc')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body.error).toBeDefined();
    });
  });
});
