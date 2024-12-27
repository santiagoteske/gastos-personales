const jsonServer = require('json-server');
const path = require("path");
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

// Usar middlewares predeterminados de json-server
server.use(middlewares);

// Agregar un delay opcional para simular latencia de red
server.use((req, res, next) => {
  setTimeout(next, 500);
});

// Usar el router de json-server
server.use(router);

// Iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server está corriendo en http://localhost:${PORT}`);
});
