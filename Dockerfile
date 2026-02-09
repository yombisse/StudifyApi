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

# Expose le port sur lequel l'API écoute
# Render définit PORT dynamiquement, on utilise donc cette variable
EXPOSE ${PORT:-3000}

# Commande pour lancer l'API avec node en utilisant le port dynamique
CMD ["node", "index.js"]

