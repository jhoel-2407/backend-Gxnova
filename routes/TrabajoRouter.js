const express = require("express");
const router = express.Router();
const TrabajoController = require("../controllers/TrabajoController");

const verificarJWT = require("../middleware/AuthMiddleware");
const { rolMiddleware } = require("../middleware/RolMiddleware");

// Obtener todos los trabajos (público, con filtros opcionales)
router.get("/", TrabajoController.obtenerTrabajos);

// Obtener trabajo por ID (público)
router.get("/:id", TrabajoController.obtenerTrabajoPorId);

// Crear trabajo (requiere autenticación, rol Empleador o Administrador)
router.post("/",
    verificarJWT,
    rolMiddleware("Empleador", "Administrador"),
    TrabajoController.crearTrabajo
);

// Actualizar trabajo (requiere autenticación)
router.put("/:id",
    verificarJWT,
    TrabajoController.actualizarTrabajo
);

// Eliminar trabajo (requiere autenticación)
router.delete("/:id",
    verificarJWT,
    TrabajoController.eliminarTrabajo
);

module.exports = router;
