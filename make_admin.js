const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const email = process.argv[2];

if (!email) {
    console.error("❌ Error: Por favor proporciona el correo del usuario.");
    console.log("👉 Uso: node make_admin.js correo@ejemplo.com");
    process.exit(1);
}

async function main() {
    console.log(`🔍 Buscando usuario con correo: ${email}...`);

    // 1. Buscar Usuario
    const usuario = await prisma.usuario.findUnique({
        where: { correo: email }
    });

    if (!usuario) {
        console.error(`❌ Usuario con correo '${email}' no encontrado.`);
        process.exit(1);
    }
    console.log(`✅ Usuario encontrado: ${usuario.nombre} ${usuario.apellido}`);

    // 2. Buscar Rol Administrador
    const rolAdmin = await prisma.rol.findUnique({
        where: { nombre: 'Administrador' }
    });

    if (!rolAdmin) {
        console.error("❌ Error CRÍTICO: El rol 'Administrador' no existe en la base de datos.");
        process.exit(1);
    }

    // 3. Asignar Rol
    // Verificar si ya lo tiene para no duplicar error
    const existing = await prisma.usuarioEnRol.findUnique({
        where: {
            id_usuario_id_rol: {
                id_usuario: usuario.id_usuario,
                id_rol: rolAdmin.id_rol
            }
        }
    });

    if (existing) {
        console.log(`⚠️ El usuario ${email} YA es Administrador.`);
    } else {
        await prisma.usuarioEnRol.create({
            data: {
                id_usuario: usuario.id_usuario,
                id_rol: rolAdmin.id_rol
            }
        });
        console.log(`🎉 ¡ÉXITO! El usuario ${email} ahora tiene permisos de Administrador.`);
    }
}

main()
    .catch(e => {
        console.error("❌ Error inesperado:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
