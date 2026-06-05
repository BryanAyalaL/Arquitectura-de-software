# Middlewares

Descripción de los middlewares disponibles en el proyecto.

## authMiddleware
- Propósito: validar el `Authorization: Bearer <token>` y poblar `req.user` con el payload decodificado.
- Variables relevantes: `JWT_SECRET` (env)
- Responde `401` si falta o el token es inválido.

## loggerMiddleware
- Propósito: registrar peticiones HTTP en consola.
- Uso: `app.use(loggerMiddleware)` antes de las rutas.

## errorMiddleware
- Propósito: captura errores y devuelve una respuesta estándar `500`.
- Uso: registrarlo como middleware de manejo de errores al final del stack.
