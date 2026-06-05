# ADR-004 — Implementación de Seguridad con JWT

## Estado
Aceptado

## Contexto

El sistema requiere proteger rutas sensibles relacionadas con usuarios y operaciones internas.

Dentro de los requisitos no funcionales se definió la seguridad como un atributo de calidad importante, especialmente el control de acceso y autenticación.

Se necesitaba una solución compatible con APIs REST y arquitectura en 3 capas.

## Decisión

Se decidió implementar autenticación basada en JWT (JSON Web Token).

La autenticación se realiza mediante:

- Access Token con expiración corta
- Middleware de validación (`authMiddleware.js`)
- Protección de rutas privadas
- bcrypt para manejo seguro de contraseñas

## Justificación

JWT fue elegido porque:

- Es stateless (no requiere sesiones en servidor)
- Facilita escalabilidad
- Se integra fácilmente con APIs REST
- Reduce acoplamiento entre cliente y servidor

## Rutas

### Públicas
- POST /login

### Privadas
- GET /users
- GET /users/:id

## Consecuencias positivas

- Mayor seguridad en endpoints
- Bajo acoplamiento
- Escalabilidad sencilla
- Arquitectura más mantenible

## Consecuencias negativas

- Manejo de expiración de tokens
- Complejidad mayor frente a autenticación tradicional con sesiones

## Alternativas consideradas

### Sesiones tradicionales
Descartadas porque requieren almacenamiento de sesión en servidor y generan mayor acoplamiento.

## Relación con RNF

Esta decisión responde al RNF de seguridad definido en Ingeniería de Software:

- control de acceso
- autenticación segura
- protección de recursos internos
