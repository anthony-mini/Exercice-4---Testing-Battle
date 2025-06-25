# Étape de construction
FROM node:22-alpine AS builder

WORKDIR /app

# 1. Copie des fichiers de dépendances (étape mise en cache)
COPY package.json package-lock.json* ./

# 2. Installation des dépendances (mise en cache si package.json inchangé)
RUN npm ci --no-audit --prefer-offline

# Étape d'exécution finale
FROM node:22-alpine

WORKDIR /app

# Copie des fichiers de dépendances (depuis le builder)
COPY --from=builder /app/node_modules ./node_modules

# Copie du reste de l'application (cette étape invalidera le cache si le code change)
COPY . .

# Création du dossier pour les logs
RUN mkdir -p logs

# Exposition des ports
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
