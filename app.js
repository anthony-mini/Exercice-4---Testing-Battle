const express = require('express');
const cors = require('cors');
const { port } = require('./config');

// Import des routes
const conversionRoutes = require('./src/routes/conversionRoutes');
const tvaRoutes = require('./src/routes/tvaRoutes');
const remiseRoutes = require('./src/routes/remiseRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route de bienvenue
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Conversion et Calculs Financiers',
    version: '1.0.0',
    endpoints: [
      '/convert?from=EUR&to=USD&amount=100',
      '/tva?ht=100&taux=20',
      '/remise?prix=100&pourcentage=10'
    ] 
  });
});

// Intégration des routes
app.use(conversionRoutes);
app.use(tvaRoutes);
app.use(remiseRoutes);

// Middleware 404 - Route non trouvée
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Une erreur interne est survenue' });
});

// Démarrage du serveur
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${port} (0.0.0.0)`);
});

module.exports = { app, server };
