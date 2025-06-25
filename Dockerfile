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

# Création du dossier pour les logs et réglage des permissions
RUN mkdir -p /app/logs && chown -R node:node /app

# Utilisateur non-root pour la sécurité
USER node

# Exposition des ports
EXPOSE 3000

# Copie du code de l'application (après avoir défini les permissions)
COPY --chown=node:node . .

# Commande de démarrage pour la production
CMD ["node", "server.js"]
