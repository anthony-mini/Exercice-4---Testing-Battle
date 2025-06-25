# Étape de développement
FROM node:18 AS development

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./


# Installation des dépendances
RUN npm install

# Copie du reste de l'application
COPY . .

# Commande par défaut pour le développement
CMD ["npm", "run", "dev"]

# Étape de production
FROM node:18-slim AS production

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances de production uniquement
RUN npm ci --only=production

# Copie du code de l'application
COPY . .

# Utilisateur non-root pour la sécurité
USER node

# Création du dossier pour les logs
RUN mkdir -p logs

# Exposition des ports
EXPOSE 3000

# Commande de démarrage pour la production
CMD ["node", "server.js"]
