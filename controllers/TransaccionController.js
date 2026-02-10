const TransaccionService = require("../services/TransaccionService");

const TransaccionController = {
    async obtenerTransacciones(req, res) {
        try {
            const filtros = {
                id_acuerdo: req.query.id_acuerdo,
                estado: req.query.estado
            };

            const transacciones = await TransaccionService.obtenerTransacciones(filtros);
            return res.status(200).json({ transacciones });
        } catch (error) {
            console.error("Error en TransaccionController.obtenerTransacciones:", error);
            return res.status(500).json({ error: 'Error al obtener las transacciones.' });
        }
    },

    async obtenerTransaccionPorId(req, res) {
        const id = parseInt(req.params.id);

        try {
            const transaccion = await TransaccionService.obtenerPorId(id);

            if (!transaccion) {
                return res.status(404).json({ error: 'Transacción no encontrada.' });
            }

            return res.status(200).json({ transaccion });
        } catch (error) {
            console.error("Error en TransaccionController.obtenerTransaccionPorId:", error);
            return res.status(500).json({ error: 'Error al obtener la transacción.' });
        }
    },

    async crearTransaccion(req, res) {
        const { id_acuerdo, tipo_pago, detalle } = req.body;

        if (!id_acuerdo || !tipo_pago) {
            return res.status(400).json({
                error: 'Faltan campos obligatorios: id_acuerdo, tipo_pago.'
            });
        }

        try {
            const nuevaTransaccion = await TransaccionService.crearTransaccion({
                id_acuerdo: parseInt(id_acuerdo),
                tipo_pago,
                detalle
            });

            return res.status(201).json({
                message: "Transacción creada exitosamente.",
                transaccion: nuevaTransaccion
            });
        } catch (error) {
            console.error("Error en TransaccionController.crearTransaccion:", error);
            return res.status(500).json({ error: 'Error al crear la transacción.' });
        }
    },

    async actualizarTransaccion(req, res) {
        const id = parseInt(req.params.id);

        try {
            const transaccionExistente = await TransaccionService.obtenerPorId(id);
            if (!transaccionExistente) {
                return res.status(404).json({ error: 'Transacción no encontrada.' });
            }

            const transaccionActualizada = await TransaccionService.actualizarTransaccion(id, req.body);

            return res.status(200).json({
                message: "Transacción actualizada correctamente.",
                transaccion: transaccionActualizada
            });
        } catch (error) {
            console.error("Error en TransaccionController.actualizarTransaccion:", error);
            return res.status(500).json({ error: 'Error al actualizar la transacción.' });
        }
    },

    async eliminarTransaccion(req, res) {
        const id = parseInt(req.params.id);

        try {
            const transaccionExistente = await TransaccionService.obtenerPorId(id);
            if (!transaccionExistente) {
                return res.status(404).json({ error: 'Transacción no encontrada.' });
            }

            await TransaccionService.eliminarTransaccion(id);

            return res.status(200).json({
                message: "Transacción eliminada correctamente."
            });
        } catch (error) {
            console.error("Error en TransaccionController.eliminarTransaccion:", error);
            return res.status(500).json({ error: 'Error al eliminar la transacción.' });
        }
    },

    async completarTransaccion(req, res) {
        const id = parseInt(req.params.id);

        try {
            const transaccionExistente = await TransaccionService.obtenerPorId(id);
            if (!transaccionExistente) {
                return res.status(404).json({ error: 'Transacción no encontrada.' });
            }

            const transaccionCompletada = await TransaccionService.completarTransaccion(id);

            return res.status(200).json({
                message: "Transacción completada correctamente.",
                transaccion: transaccionCompletada
            });
        } catch (error) {
            console.error("Error en TransaccionController.completarTransaccion:", error);
            return res.status(500).json({ error: 'Error al completar la transacción.' });
        }
    }
};

module.exports = TransaccionController;

