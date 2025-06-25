require('dotenv').config();

const environments = {
  development: {
    port: 3000,
    envName: 'development'
  },
  production: {
    port: process.env.PORT || 80,
    envName: 'production'
  }
};

const environment = process.env.NODE_ENV?.toLowerCase() || 'development';
const config = environments[environment] || environments.development;

module.exports = config;
