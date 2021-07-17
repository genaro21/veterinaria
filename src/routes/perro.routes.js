const { Router } = require("express");

const fs = require("fs");
const strdb = fs.readFileSync("./src/database.json", "utf-8");
const database = JSON.parse(strdb);

const uuid = require("uuid");

const router = Router();

router.post("/crearperro/:id", (req, res) => {
  const { nombre, edad, raza } = req.body;

  if (!nombre || !edad || !raza) {
    return res.json({ error: "Debes rellenar todos los campos" });
  }
  const newPerro = {
    id: uuid.v4(),
    nombre,
    edad,
    raza,
  };

  database.perros.push(newPerro);
  let cliente = null;
  for (let i = 0; i < database.clientes.length; i++) {
    if (req.body.idcliente === database.clientes[i].id) {
      cliente = database.clientes[i];
      database.clientes[i].perros.push(newPerro.id);
      break;
    }
  }
  fs.writeFile("./src/database.json", JSON.stringify(database), () => {});

  return res.json(newPerro);
});

router.get("/listarperro", (req, res) => {
  res.json(database.perros);
});

router.get("/getperro/:id", (req, res) => {
  const perroId = req.params.id;

  let perro = null;
  for (let i = 0; i < database.perros.length; i++) {
    if (database.perros[i].id === perroId) {
      perro = database.perros[i];
      break;
    }
  }
  res.json({ perro });
});

router.put("/actualizarperro/:id", (req, res) => {
  const perroId = req.params.id;

  let perro = null;
  for (let i = 0; i < database.perros.length; i++) {
    if (database.perros[i].id === perroId) {
      perro = database.perros[i];
      perro.nombre = req.body.nombre;
      perro.edad = req.body.edad;
      perro.raza = req.body.raza;
      database.perros[i].nombre = perro.nombre;
      database.perros[i].edad = perro.edad;
      database.perros[i].raza = perro.raza;
      break;
    }
  }
  fs.writeFile("./src/database.json", JSON.stringify(database), () => {});
  res.json({ perro });
});

router.delete("/borrarperro/:id", (req, res) => {
  const perroId = req.params.id;

  let index = -1;
  for (let i = 0; i < database.perros.length; i++) {
    if (database.perros[i].id === perroId) {
      index = i;
      break;
    }
  }
  if (index > -1) {
    database.perros.splice(index, 1);
  }
  res.json(database.perros);
});

module.exports = router;
