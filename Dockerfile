# Dockerfile - Image Node.js pour StudifyAPI
# Utilise l'image officielle Node.js version 18 LTS
FROM node:18

# Crée le dossier de travail dans le conteneur
WORKDIR /StudifyApi

# Copie d'abord les fichiers de dépendances (pour le cache Docker)
COPY package*.json ./

# Installe les dépendances npm
RUN npm install

# Copie tout le reste du projet
# Note: Les fichiers .dockerignore sont automatiquement exclus
COPY . .

# Expose le port sur lequel l'API écoute (défini dans server.js)
EXPOSE 3000

# Commande pour lancer l'API avec node directement
# Pas de "npm start" car le script n'est pas défini dans package.json
CMD ["node", "index.js"]

