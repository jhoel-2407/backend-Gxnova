const express = require("express");
const router = express.Router();
const TransaccionController = require("../controllers/TransaccionController");

const verificarJWT = require("../middleware/AuthMiddleware");
const { rolMiddleware } = require("../middleware/RolMiddleware");

// Obtener todas las transacciones (requiere autenticación)
router.get("/",
    verificarJWT,
    TransaccionController.obtenerTransacciones
);

// Obtener transacción por ID (requiere autenticación)
router.get("/:id",
    verificarJWT,
    TransaccionController.obtenerTransaccionPorId
);

// Crear transacción (requiere autenticación)
router.post("/",
    verificarJWT,
    TransaccionController.crearTransaccion
);

// Actualizar transacción (requiere autenticación)
router.put("/:id",
    verificarJWT,
    TransaccionController.actualizarTransaccion
);

// Eliminar transacción (requiere autenticación, solo Administrador)
router.delete("/:id",
    verificarJWT,
    rolMiddleware("Administrador"),
    TransaccionController.eliminarTransaccion
);

// Completar transacción (requiere autenticación)
router.patch("/:id/completar",
    verificarJWT,
    TransaccionController.completarTransaccion
);

module.exports = router;

