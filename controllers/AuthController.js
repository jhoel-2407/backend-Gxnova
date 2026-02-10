const AuthServices = require("../services/AuthServices");

const AuthController = {

    async register(req, res) {
        // Desestructuración de datos
        const { nombre, apellido, correo, password, telefono, rolNombre } = req.body;

        try {
            // Validación mínima del Controller
            if (!correo || !password) {
                return res.status(400).json({ message: 'El correo y la contraseña son obligatorios.' });
            }

            // Verificar si vienen archivos
            let foto_cedula_path = null;
            let foto_perfil_path = null;

            if (req.files) {
                if (req.files.foto_cedula && req.files.foto_cedula[0]) {
                    // Construir URL completa
                    foto_cedula_path = `${req.protocol}://${req.get('host')}/uploads/${req.files.foto_cedula[0].filename}`;
                }
                if (req.files.foto_perfil && req.files.foto_perfil[0]) {
                    foto_perfil_path = `${req.protocol}://${req.get('host')}/uploads/${req.files.foto_perfil[0].filename}`;
                }
            }

            // Llamada al Servicio
            const result = await AuthServices.register({
                nombre,
                apellido,
                correo,
                password,
                telefono,
                rolNombre,
                foto_cedula_path,
                foto_perfil_path
            });

            // Respuesta de Éxito HTTP 201 Created
            return res.status(201).json({
                message: "Usuario registrado exitosamente.",
                usuario: result.usuario, // Ya limpio
                token: result.token
            });

        } catch (error) {
            // Manejo de Errores
            // Si el servicio detecta que el correo ya existe:
            if (error.message.includes("ya está registrado")) {
                return res.status(409).json({ message: error.message }); // 409 Conflict
            }

            // Si el servicio detecta que el rol no es válido:
            if (error.message.includes("no es válido") || error.message.includes("no encontrado")) {
                return res.status(400).json({ message: error.message }); // 400 Bad Request
            }

            console.error("Error en AuthController.register:", error.message);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    /*
     POST /auth/login
     Inicia sesión y devuelve el JWT.
     */
    async login(req, res) {
        const { correo, password } = req.body;

        try {
            // Validación mínima del Controller
            if (!correo || !password) {
                return res.status(400).json({ message: 'Faltan credenciales.' });
            }

            // Llamada al Servicio
            const result = await AuthServices.login({
                correo,
                password,
            });

            // Respuesta de Éxito HTTP 200 OK
            return res.status(200).json(result);

        } catch (error) {
            // Manejo de Errores
            // Si el servicio lanza un error de credenciales:
            if (error.message.includes("Credenciales inválidas")) {
                return res.status(401).json({ message: 'Correo o contraseña incorrectos.' }); // 401 Unauthorized
            }

            console.error("Error en AuthController.login:", error.message);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    },

    /*
     POST /auth/logout
     Cierre de sesión (principalmente notificando al cliente).
     */
    async logout(req, res) {
        // En un sistema JWT stateless, el servicio de logout no hace mucho.
        await AuthServices.logout();

        return res.status(200).json({ message: "Sesión cerrada. El token JWT debe ser eliminado por el cliente." });
    },
};

module.exports = AuthController;