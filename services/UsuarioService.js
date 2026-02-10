const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const UsuarioService = {

    async obtenerUsuarios() {
        return prisma.usuario.findMany({
            include: {
                rolesAsignados: {
                    include: {
                        rol: true
                    }
                }
            },
            orderBy: {
                fecha_registro: 'desc'
            }
        });
    },

    async obtenerPorId(id) {
        return prisma.usuario.findUnique({
            where: { id_usuario: id },
            include: {
                rolesAsignados: {
                    select: {
                        rol: {
                            select: { id_rol: true, nombre: true },
                        },
                    },
                },
                habilidades: {
                    include: {
                        categoria: true
                    }
                }
            },
        });
    },

    async obtenerPorCorreo(correo) {
        return prisma.usuario.findUnique({
            where: { correo },
        });
    },

    async crearUsuario(data) {
        return prisma.usuario.create({ data });
    },

    async obtenerRolPorNombre(nombre) {
        return prisma.rol.findUnique({
            where: { nombre },
            select: { id_rol: true }
        });
    },

    async asignarRolAUsuario(id_usuario, id_rol) {
        return prisma.usuarioEnRol.create({
            data: {
                id_usuario,
                id_rol,
            }
        });
    },

    async agregarRol(id_usuario, nombre_rol) {
        const rol = await prisma.rol.findUnique({ where: { nombre: nombre_rol } });
        if (!rol) throw new Error("Rol no encontrado");

        const existe = await prisma.usuarioEnRol.findUnique({
            where: {
                id_usuario_id_rol: {
                    id_usuario: parseInt(id_usuario),
                    id_rol: rol.id_rol
                }
            }
        });

        if (existe) return existe;

        return prisma.usuarioEnRol.create({
            data: {
                id_usuario: parseInt(id_usuario),
                id_rol: rol.id_rol
            }
        });
    },

    async actualizarUsuario(id, data) {
        return prisma.usuario.update({
            where: { id_usuario: id },
            data,
        });
    },

    async eliminarUsuario(id) {
        return prisma.usuario.delete({
            where: { id_usuario: id },
        });
    },
};

module.exports = UsuarioService;
