const BASE_URL = 'http://localhost:3000/api';

async function test() {
    console.log("=== INICIANDO PRUEBAS DE API ===\n");

    try {
        // 1. REGISTRO
        console.log("1. Probando Registro de Usuario...");
        const registerRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: "Test",
                apellido: "User",
                correo: `testuser_${Date.now()}@example.com`,
                password: "password123",
                telefono: "1234567890",
                rolNombre: "Trabajador"
            })
        });
        const registerData = await registerRes.json();

        if (registerRes.ok) {
            console.log("✅ Registro Exitoso:", registerData.usuario.correo);
        } else {
            console.error("❌ Falló Registro:", registerData);
            return;
        }

        // 2. LOGIN (Usuario Nuevo)
        console.log("\n2. Probando Login (Usuario Nuevo)...");
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo: registerData.usuario.correo,
                password: "password123"
            })
        });
        const loginData = await loginRes.json();

        if (loginRes.ok) {
            console.log("✅ Login Exitoso. Token recibido.");
        } else {
            console.error("❌ Falló Login:", loginData);
            return;
        }
        const userToken = loginData.token;

        // 3. LOGIN EMPLEADOR (Datos del Seed: carlos@cliente.com / password123)
        console.log("\n3. Probando Login Empleador (Seed)...");
        const empLoginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo: "carlos@cliente.com",
                password: "password123"
            })
        });
        const empData = await empLoginRes.json();

        if (empLoginRes.ok) {
            console.log("✅ Login Empleador Exitoso.");
        } else {
            console.error("❌ Falló Login Empleador:", empData);
            return;
        }
        const empToken = empData.token;

        // 4. CREAR TRABAJO (Usando Token de Empleador)
        console.log("\n4. Probando Crear Trabajo...");
        const jobRes = await fetch(`${BASE_URL}/trabajos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${empToken}`
            },
            body: JSON.stringify({
                id_categoria: 1, // Plomería (del seed)
                titulo: "Prueba Automática de Trabajo",
                descripcion: "Este es un trabajo creado por el script de prueba.",
                tipo_pago: "dinero",
                monto_pago: 100.00,
                ubicacion: "Test Location",
                latitud: 4.60,
                longitud: -74.08
            })
        });
        const jobData = await jobRes.json();

        if (jobRes.ok) {
            console.log("✅ Trabajo Creado Exitosamente ID:", jobData.trabajo.id_trabajo);
        } else {
            console.error("❌ Falló Crear Trabajo:", jobData);
        }


        // 5. LISTAR TRABAJOS (Público)
        console.log("\n5. Probando Listar Trabajos...");
        const listRes = await fetch(`${BASE_URL}/trabajos`);
        const listData = await listRes.json();

        let trabajoId = null;

        if (listRes.ok) {
            console.log(`✅ Listado Exitoso. Se encontraron ${listData.trabajos.length} trabajos.`);
            // Buscar el trabajo que acabamos de crear
            const trabajoCreado = listData.trabajos.find(t => t.titulo === "Prueba Automática de Trabajo");
            if (trabajoCreado) trabajoId = trabajoCreado.id_trabajo;
        } else {
            console.error("❌ Falló Listar Trabajos:", listData);
        }

        // 6. ACTUALIZAR TRABAJO
        if (trabajoId) {
            console.log(`\n6. Probando Actualizar Trabajo ID: ${trabajoId}...`);
            const updateRes = await fetch(`${BASE_URL}/trabajos/${trabajoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${empToken}`
                },
                body: JSON.stringify({
                    titulo: "Prueba Automática de Trabajo (Actualizado)",
                    monto_pago: 150.00
                })
            });
            const updateData = await updateRes.json();

            if (updateRes.ok) {
                console.log("✅ Trabajo Actualizado Correctamente.");
            } else {
                console.error("❌ Falló Actualizar Trabajo:", updateData);
            }
        }

        // 7. AGREGAR HABILIDAD (Usuario Trabajador)
        console.log("\n7. Probando Agregar Habilidad...");
        const skillRes = await fetch(`${BASE_URL}/habilidades`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({
                id_categoria: 1, // Plomería
                descripcion: "Habilidad desde test",
                tarifa_hora: 25.00
            })
        });
        const skillData = await skillRes.json();

        if (skillRes.ok) {
            console.log("✅ Habilidad Agregada Correctamente.");
        } else {
            console.error("❌ Falló Agregar Habilidad:", skillData);
        }

        // 8. ELIMINAR TRABAJO (Limpieza)
        if (trabajoId) {
            console.log(`\n8. Probando Eliminar Trabajo ID: ${trabajoId}...`);
            const deleteRes = await fetch(`${BASE_URL}/trabajos/${trabajoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${empToken}`
                }
            });

            if (deleteRes.ok) {
                console.log("✅ Trabajo Eliminado Correctamente.");
            } else {
                console.error("❌ Falló Eliminar Trabajo.");
            }
        }

    } catch (error) {
        console.error("❌ Error Crítico en el Script:", error);
    }
}

test();
