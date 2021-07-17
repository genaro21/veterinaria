const { Router } = require("express");

const uuid = require("uuid");

const fs = require("fs");
const strdb = fs.readFileSync("./src/database.json", "utf-8");
const database = JSON.parse(strdb);

const router = Router();

router.post("/crearamo", (req, res) => {
  const { dni, nombre, apellido, perros } = req.body;

  if (!dni || !nombre || !apellido) {
    return res.json({ error: "Debes rellenar todos los campos" });
  }
  const newCliente = {
    id: uuid.v4(),
    dni: req.body.dni,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    perros: [],
  };

  database.clientes.push(newCliente);
  fs.writeFile("./src/database.json", JSON.stringify(database), () => {});
  res.json(newCliente);
});

router.get("/listaramo", (req, res) => {
  res.json(database.clientes);
});

router.get("/getamo/:id", (req, res) => {
  const amoId = req.params.id;

  let amo = null;
  for (let i = 0; i < database.clientes.length; i++) {
    if (database.clientes[i].id === amoId) {
      amo = database.clientes[i];
      break;
    }
  }
  res.json({ amo });
});

router.put("/actualizaramo/:id", (req, res) => {
  const amoId = req.params.id;

  let amo = null;
  for (let i = 0; i < database.clientes.length; i++) {
    if (database.clientes[i].id === amoId) {
      amo = database.clientes[i];
      amo.dni = req.body.dni;
      amo.nombre = req.body.nombre;
      amo.apellido = req.body.apellido;
      database.clientes[i].dni = amo.dni;
      database.clientes[i].nombre = amo.nombre;
      database.clientes[i].apellido = amo.apellido;
      break;
    }
  }
  fs.writeFile("./src/database.json", JSON.stringify(database), () => {});
  res.json({ amo });
});

router.delete("/borraramo/:id", (req, res) => {
  const amoId = req.params.id;

  let index = -1;
  for (let i = 0; i < database.clientes.length; i++) {
    if (database.clientes[i].id === amoId) {
      index = i;
      break;
    }
  }
  if (index > -1) {
    database.clientes.splice(index, 1);
  }
  res.json(database.clientes);
});

module.exports = router;
