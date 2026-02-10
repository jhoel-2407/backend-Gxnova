const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const TransaccionService = {
    async obtenerTransacciones(filtros = {}) {
        const where = {};

        if (filtros.id_acuerdo) {
            where.id_acuerdo = parseInt(filtros.id_acuerdo);
        }

        if (filtros.estado) {
            where.estado = filtros.estado;
        }

        return prisma.transaccion.findMany({
            where,
            include: {
                acuerdo: {
                    include: {
                        trabajo: {
                            select: {
                                id_trabajo: true,
                                titulo: true,
                                empleador: {
                                    select: {
                                        id_usuario: true,
                                        nombre: true,
                                        apellido: true
                                    }
                                }
                            }
                        },
                        trabajador: {
                            select: {
                                id_usuario: true,
                                nombre: true,
                                apellido: true
                            }
                        }
                    }
                }
            },
            orderBy: { fecha: 'desc' }
        });
    },

    async obtenerPorId(id) {
        return prisma.transaccion.findUnique({
            where: { id_transaccion: id },
            include: {
                acuerdo: {
                    include: {
                        trabajo: {
                            include: {
                                empleador: {
                                    select: {
                                        id_usuario: true,
                                        nombre: true,
                                        apellido: true,
                                        correo: true
                                    }
                                },
                                categoria: true
                            }
                        },
                        trabajador: {
                            select: {
                                id_usuario: true,
                                nombre: true,
                                apellido: true,
                                correo: true
                            }
                        }
                    }
                }
            }
        });
    },

    async crearTransaccion(data) {
        return prisma.transaccion.create({
            data: {
                id_acuerdo: data.id_acuerdo,
                tipo_pago: data.tipo_pago,
                detalle: data.detalle,
                estado: 'pendiente'
            },
            include: {
                acuerdo: {
                    include: {
                        trabajo: {
                            select: {
                                id_trabajo: true,
                                titulo: true
                            }
                        }
                    }
                }
            }
        });
    },

    async actualizarTransaccion(id, data) {
        const updateData = {};

        if (data.detalle !== undefined) updateData.detalle = data.detalle;
        if (data.estado) updateData.estado = data.estado;

        return prisma.transaccion.update({
            where: { id_transaccion: id },
            data: updateData,
            include: {
                acuerdo: {
                    include: {
                        trabajo: true,
                        trabajador: true
                    }
                }
            }
        });
    },

    async eliminarTransaccion(id) {
        return prisma.transaccion.delete({
            where: { id_transaccion: id }
        });
    },

    async completarTransaccion(id) {
        return prisma.transaccion.update({
            where: { id_transaccion: id },
            data: { estado: 'completado' },
            include: {
                acuerdo: {
                    include: {
                        trabajo: true,
                        trabajador: true
                    }
                }
            }
        });
    }
};

module.exports = TransaccionService;

