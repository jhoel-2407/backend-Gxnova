const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("🔍 Buscando datos necesarios...");

        // 1. Buscar un empleador
        const empleador = await prisma.usuario.findFirst({
            where: {
                rolesAsignados: {
                    some: {
                        rol: { nombre: 'Empleador' }
                    }
                }
            }
        });

        if (!empleador) {
            console.error("❌ No se encontró ningún usuario con rol 'Empleador'. Ejecuta el seed primero.");
            return;
        }

        // 2. Buscar una categoría
        const categoria = await prisma.categoria.findFirst();
        if (!categoria) {
            console.error("❌ No se encontró ninguna categoría.");
            return;
        }

        // 3. Calcular fecha para mañana (dentro de 20 horas para que sea < 24h)
        const fechaUrgente = new Date();
        fechaUrgente.setHours(fechaUrgente.getHours() + 20);

        // 4. Crear el trabajo urgente
        const trabajo = await prisma.trabajo.create({
            data: {
                id_empleador: empleador.id_usuario,
                id_categoria: categoria.id_categoria,
                titulo: "🆘 URGENTE: Reparación de Tubería Rota",
                descripcion: "Necesito un plomero urgente, se rompió la tubería principal y se está inundando la cocina. ¡Pago extra por urgencia!",
                tipo_pago: 'dinero',
                monto_pago: 150000,
                ubicacion: "Bogotá, Chapinero",
                fecha_estimada: fechaUrgente,
                estado: 'publicado'
            }
        });

        console.log(`✅ Trabajo URGENTE creado con éxito!`);
        console.log(`🆔 ID: ${trabajo.id_trabajo}`);
        console.log(`📅 Cierra en: ${fechaUrgente.toLocaleString()}`);
        console.log(`👤 Empleador: ${empleador.nombre} ${empleador.apellido}`);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
