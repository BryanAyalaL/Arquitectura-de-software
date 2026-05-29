# ADR-006 — Implementación de Cache-Aside con Redis

## Estado

Aceptado

## Contexto

El sistema requiere optimizar consultas frecuentes para mejorar rendimiento durante pruebas de carga.

Dentro de los atributos de calidad definidos se identificó rendimiento y disponibilidad como factores importantes para soportar concurrencia y reducir consultas repetitivas.

Durante el laboratorio se necesitaba una solución compatible con la arquitectura actual basada en API REST.

## Decisión

Se decidió implementar el patrón Cache-Aside utilizando Redis.

La estrategia implementada funciona mediante:

* Consulta inicial a Redis (`redisClient.get("users")`)
* Cache HIT → responder desde caché
* Cache MISS → consultar repositorio / BD simulada
* Almacenamiento temporal usando TTL de 60 segundos (`setEx`)
* Aplicación inicial sobre el endpoint `GET /users`

## Justificación

Redis fue elegido porque:

* Reduce consultas repetitivas a la capa de datos
* Mejora tiempo de respuesta
* Es compatible con arquitecturas REST
* Facilita escalabilidad horizontal
* Tiene integración sencilla con Node.js

## Endpoint Cacheado

### Protegido con JWT

* GET /users

## Consecuencias positivas

* Menor carga sobre la base de datos simulada
* Mejor rendimiento bajo concurrencia
* Reducción de latencia
* Mejor comportamiento durante pruebas de estrés

## Consecuencias negativas

* Posible desactualización temporal de datos
* Dependencia adicional (Redis)
* Mayor complejidad operacional

## Alternativas consideradas

### Consulta directa a BD sin caché

Descartada porque incrementa consultas repetitivas y reduce rendimiento bajo carga.

### Caché en memoria local

Descartada porque limita escalabilidad y persistencia entre instancias.

## Relación con RNF

Esta decisión responde a los RNF definidos en Ingeniería de Software:

* rendimiento
* disponibilidad
* optimización de consultas
* escalabilidad arquitectónica
