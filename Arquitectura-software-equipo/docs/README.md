# Documentación del proyecto

Carpeta `docs/` contiene:

- `adr/` : Decision Records de arquitectura.
- `api/` : Documentación de endpoints y módulos (esta carpeta).
- `POSTMAN-TEST-LAB7.md` : Colección y pasos de prueba en Postman.

## Índice rápido

- [API - Autenticación](api/auth.md)
- [API - Usuarios](api/users.md)
- [Middlewares](api/middleware.md)
- ADRs: ver `adr/`.

## Cómo correr la API localmente

Variables de entorno recomendadas:

- `PORT` (ej. 3000)
- `JWT_SECRET` (secreto para access tokens)
- `REFRESH_SECRET` (secreto para refresh tokens)
- `REDIS_URL` o configurar `RedisClient` en `src/Config/RedisClient.js`

Comandos útiles:

```bash
npm install
node src/server.js
```

Si quieres que genere documentación más detallada (OpenAPI/Swagger o Markdown por controlador), dime y la añado.
