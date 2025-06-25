require('dotenv').config();
const { app, server } = require('./app');

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // En production, vous pourriez vouloir logger cette erreur
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // En production, vous pourriez vouloir logger cette erreur et redémarrer le processus
  process.exit(1);
});

// Gestion de l'arrêt propre
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
