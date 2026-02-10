// app.js - Serveur final complet
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const config = require("./src/models/db");

const app = express();
const path = require('path');
// Permet de servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Middleware global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pool de connexions à la base de données
// Le pool gère automatiquement les connexions multiples et la reconnexion
// Note: mysql2/promise retourne déjà l'API avec promises
const db = mysql.createPool({
  ...config.db,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Vérifier la connexion au démarrage
(async () => {
  try {
    const connection = await db.getConnection();
    console.log(" Connecté à la base de données MySQL");
    connection.release();
  } catch (err) {
    console.error(" Erreur de connexion à la base de données:", err.message);
    process.exit(1);
  }
})();

// Middleware pour injecter la DB dans req
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Page d'accueil / Documentation (fichier statique)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// API Routes
app.use("/api/students", require("./src/routes/students"));
app.use("/api/auth", require("./src/routes/authRoutes"));

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(" Erreur:", err.stack);
  res.status(500).json({
    success: false,
    errors: { general: "Erreur interne du serveur" }
  });
});

// Gestion des routes 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    errors: { general: "Route non trouvée" }
  });
});
module.exports = app;