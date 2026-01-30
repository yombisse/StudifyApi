// app.js - Serveur final complet
const express = require("express");
const session = require("express-session");
const mysql = require("mysql2");
const cors = require("cors");
const config = require("./src/models/db");

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⚡ Configuration des sessions
app.use(session({
  secret: "studify_secret_key", // clé secrète pour signer le cookie
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // mettre true si HTTPS
}));

// Connexion à la base de données
const db = mysql.createConnection(config.db);

db.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion à la base de données:", err.message);
    process.exit(1);
  }
  console.log("✅ Connecté à la base de données MySQL");
});

// Middleware pour injecter la DB dans req
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use("/api/students", require("./src/routes/students"));
app.use("/api/users", require("./src/routes/userRoutes"));

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error("❌ Erreur:", err.stack);
  res.status(500).json({
    success: false,
    error: "Erreur interne du serveur",
    message: err.message,
  });
});

// Gestion des routes 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
  });
});

// Démarrage du serveur
const PORT = config.server.port || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 API disponible sur http://localhost:${PORT}/api/students`);
});

module.exports = app;
