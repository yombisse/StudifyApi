const app = require("./server"); 
const config = require("./src/models/db"); 

// Render fournit PORT via les variables d'environnement
const PORT = process.env.PORT || 3000 ;

app.listen(PORT, () => {
  console.log(` Serveur démarré sur le port ${PORT}`);
  console.log(` API disponible sur http://localhost:${PORT}/api`);
});

module.exports = app;
