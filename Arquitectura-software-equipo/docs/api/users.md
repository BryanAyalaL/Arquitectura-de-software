# Usuarios (Users)

Endpoints relacionados con gestión de usuarios.

## GET /users
- Autenticado: sí (Bearer token)
- Respuestas:
  - `200`: lista de usuarios
  - `401`: token ausente o inválido

Descripción: Devuelve la lista de usuarios. Utiliza un caché Redis (`RedisClient`) con TTL corto (ej. 60s) para reducir consultas a BD.

## GET /users/:id
- Autenticado: no necesariamente (según implementación actual)
- Respuestas:
  - `200`: usuario encontrado
  - `404`: usuario no encontrado

## POST /auth/register (crear usuario)
Ver `docs/api/auth.md`.

Notas de implementación:
- `UserController` delega en `UserRepository` para acceso a datos.
- `UserRepository` expone métodos: `getAllUsers`, `getUserById`, `getUserByEmail`, `createUser`, `updateUser`, `deleteUser`.
