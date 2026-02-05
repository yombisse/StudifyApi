const app = require("./server"); 
const config = require("./src/models/db"); 
const PORT = config.server.port || 3000;

app.listen(PORT, () => {
  console.log(` Serveur démarré sur le port ${PORT}`);
  console.log(` API disponible sur http://localhost:${PORT}/api`);
});

module.exports = app;
