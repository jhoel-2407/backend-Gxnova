const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.usuario.findMany({
        select: { correo: true, nombre: true }
    });
    console.log("Usuarios disponibles:");
    users.forEach(u => console.log(`- ${u.correo} (${u.nombre})`));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
