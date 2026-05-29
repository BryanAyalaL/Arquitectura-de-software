# Pruebas Postman — Lab 7: JWT Security

## Resumen
Este documento detalla las pruebas manuales en Postman para validar la implementación de JWT en el Lab 7.

---

## 1. Registro de Usuario (Register)

**Endpoint:** `POST http://localhost:3000/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Juan Perez",
  "email": "juan@example.com",
  "password": "securepassword123"
}
```

**Respuesta Esperada (201 Created):**
```json
{
  "id": 1,
  "name": "Juan Perez",
  "email": "juan@example.com"
}
```

---

## 2. Login de Usuario (Login)

**Endpoint:** `POST http://localhost:3000/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "juan@example.com",
  "password": "securepassword123"
}
```

**Respuesta Esperada (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Juan Perez",
    "email": "juan@example.com"
  }
}
```

---

## 3. Acceso a Ruta Protegida SIN Token (401 Unauthorized)

**Endpoint:** `GET http://localhost:3000/users`

**Headers:**
```
Content-Type: application/json
```

**Cuerpo:** (vacío)

**Respuesta Esperada (401 Unauthorized):**
```json
{
  "message": "Token invalido o expirado"
}
```

---

## 4. Acceso a Ruta Protegida CON Token Válido (200 OK)

**Endpoint:** `GET http://localhost:3000/users`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <accessToken>
```

**Nota:** Reemplazar `<accessToken>` con el token obtenido en el paso 2 (Login).

**Cuerpo:** (vacío)

**Respuesta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Juan Perez",
    "email": "juan@example.com"
  }
]
```

---

## 5. Refresh Token (Renovar Access Token)

**Endpoint:** `POST http://localhost:3000/auth/refresh`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "refreshToken": "<refreshToken>"
}
```

**Nota:** Reemplazar `<refreshToken>` con el refresh token obtenido en el paso 2 (Login).

**Respuesta Esperada (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 6. Credenciales Incorrectas (401 Unauthorized)

**Endpoint:** `POST http://localhost:3000/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "juan@example.com",
  "password": "wrongpassword"
}
```

**Respuesta Esperada (401 Unauthorized):**
```json
{
  "message": "Credenciales incorrectas"
}
```

---

## 7. Token Expirado (401 Unauthorized)

**Endpoint:** `GET http://localhost:3000/users`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDAwMDAwMDB9.expired
```

**Respuesta Esperada (401 Unauthorized):**
```json
{
  "message": "Token invalido o expirado"
}
```

---

## 8. Health Check

**Endpoint:** `GET http://localhost:3000/health`

**Headers:**
```
Content-Type: application/json
```

**Cuerpo:** (vacío)

**Respuesta Esperada (200 OK):**
```json
{
  "status": "ok",
  "uptime": 12.345678,
  "timestamp": "2024-05-22T10:30:45.123Z"
}
```

---

## Flujo Completo Recomendado

1. Registrar usuario (Step 1)
2. Login (Step 2)
3. Copiar `accessToken` y `refreshToken`
4. Acceder a ruta protegida sin token → 401 (Step 3)
5. Acceder a ruta protegida con token → 200 (Step 4)
6. Esperar 1 hora o usar token expirado → 401 (Step 7)
7. Usar refresh token → obtener nuevo accessToken (Step 5)

---

## Notas de Implementación

- **Access Token:** Expira en 1 hora
- **Refresh Token:** Expira en 7 días
- **Algoritmo:** HS256 (HMAC SHA-256)
- **Secret:** `JWT_SECRET` (variable de entorno) o `"change_this_secret"` (default)
- **Refresh Secret:** `REFRESH_SECRET` (variable de entorno) o `"refresh_secret_key"` (default)

---

## Cambios Sugeridos para Producción

1. Usar variables de entorno reales para `JWT_SECRET` y `REFRESH_SECRET`
2. Almacenar refresh tokens en base de datos (no solo en memoria)
3. Implementar token blacklist para logout
4. Usar HTTPS en producción
5. Configurar CORS según necesidad

