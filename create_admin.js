const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@gxnova.com';
    const password = 'admin123';
    const nombre = 'Admin';
    const apellido = 'Principal';

    console.log(`🚀 Iniciando creación/verificación de administrador...`);

    // 1. Obtener ID del Rol Administrador
    const rolAdmin = await prisma.rol.findUnique({
        where: { nombre: 'Administrador' }
    });

    if (!rolAdmin) {
        console.error("❌ Error: El rol 'Administrador' no existe en la base de datos. Ejecuta los seeds primero.");
        return;
    }

    // 2. Verificar si el usuario ya existe
    let user = await prisma.usuario.findUnique({
        where: { correo: email }
    });

    if (!user) {
        console.log(`👤 El usuario ${email} no existe. Creándolo...`);
        const hashedPassword = await bcrypt.hash(password, 10);

        user = await prisma.usuario.create({
            data: {
                nombre,
                apellido,
                correo: email,
                password_hash: hashedPassword,
                estado: 'activo'
            }
        });
        console.log("✅ Usuario creado exitosamente.");
    } else {
        console.log(`ℹ️ El usuario ${email} ya existe.`);
        // Opcional: Podríamos resetear la contraseña aquí si quisiéramos garantizar acceso
        // Pero mejor no tocar passwords existentes sin permiso explícito.
    }

    // 3. Asignar Rol de Administrador
    const userRole = await prisma.usuarioEnRol.findUnique({
        where: {
            id_usuario_id_rol: {
                id_usuario: user.id_usuario,
                id_rol: rolAdmin.id_rol
            }
        }
    });

    if (!userRole) {
        console.log("🛡️ Asignando rol de Administrador...");
        await prisma.usuarioEnRol.create({
            data: {
                id_usuario: user.id_usuario,
                id_rol: rolAdmin.id_rol
            }
        });
        console.log("✅ Rol asignado correctamente.");
    } else {
        console.log("✅ El usuario ya tiene el rol de Administrador.");
    }

    console.log("\n============================================");
    console.log("🎉 ADMINISTRADOR LISTO");
    console.log(`📧 Correo: ${email}`);
    console.log(`🔑 Contraseña: ${password} (Si acabas de crearlo)`);
    console.log("============================================");
    console.log("👉 Intenta iniciar sesión en http://localhost:5173/auth");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
