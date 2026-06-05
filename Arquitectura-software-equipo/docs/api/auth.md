# Autenticación (Auth)

Endpoints relacionados con autenticación y gestión de tokens.

## POST /auth/login
- Request body: `{ "email": "user@example.com", "password": "secret" }`
- Respuestas:
  - `200`: `{ accessToken, refreshToken, user }`
  - `400`: cuando faltan parámetros
  - `401`: credenciales incorrectas

Descripción: Valida credenciales contra el `UserRepository` y devuelve un `accessToken` (1h) y `refreshToken` (7d).

## POST /auth/register
- Request body: `{ "name": "Nombre", "email": "user@example.com", "password": "secret" }`
- Respuestas:
  - `201`: usuario creado
  - `400`: datos incompletos o email ya registrado

Descripción: Crea un nuevo usuario y envía un correo de bienvenida usando `EmailService`.

## POST /auth/refresh
- Request body: `{ "refreshToken": "<token>" }`
- Respuestas:
  - `200`: `{ accessToken }` (nuevo token de acceso)
  - `400` / `401`: token faltante o inválido

Descripción: Verifica el `refreshToken` y emite un nuevo `accessToken` si es válido.
