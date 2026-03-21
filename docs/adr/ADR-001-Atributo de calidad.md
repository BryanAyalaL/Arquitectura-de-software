# ADR-001: Identificación de Atributos de Calidad (ISO 25010)

* **Estado:** Aceptado
* **Fecha:** 2026-03-13
* **Autores:** Bryan Ayala Londoño · Juan Esteban Chavarria · Paul Andrés Furnieles Meza

---

## 1. Contexto

El proyecto consiste en desarrollar un software de planificación de viajes impulsado por inteligencia artificial, capaz de crear itinerarios personalizados ajustados en tiempo real según las preferencias del usuario, condiciones climáticas y disponibilidad, optimizando el tiempo y presupuesto del viajero.

**Problemas críticos del sistema heredado:**

- **Manejo manual de reservas:** las agencias dependen de múltiples plataformas para gestionar transporte, alojamiento y actividades, lo que genera errores y pérdida de tiempo. (`Driver-funcional-02`, `Driver-funcional-04`, `Driver-funcional-05`)
- **Falta de disponibilidad en tiempo real:** sin sistema centralizado es imposible conocer la disponibilidad actualizada, lo que lleva a sobreventa o falta de opciones. (`Atributo-de-calidad-04`)
- **Sin rastreo de preferencias:** no existe una plataforma que recopile y analice las preferencias del cliente para personalizar recomendaciones. (`Driver-funcional-06`)

**Restricciones:**

- `Restricción-01` — Motor de base de datos obligatorio: **MySQL**.
- `Restricción-02` — Cronograma académico fijo con entrega por fases.
- `Restricción-03` — Contexto académico que limita tecnologías disponibles y alcance.
- Equipo de tres personas con necesidad de trabajo en paralelo sin bloqueos.

---

## 2. Objetivos de Negocio

1. Automatizar la gestión de reservas (transporte, alojamiento, actividades) eliminando dependencias de múltiples plataformas.
2. Proveer disponibilidad en tiempo real mediante un sistema centralizado para eliminar la sobreventa.
3. Personalizar la experiencia del viajero mediante IA que aprende las preferencias del usuario.
4. Optimizar tiempo y presupuesto del viajero con itinerarios ajustados dinámicamente.
5. Garantizar la seguridad de los datos del usuario y la integridad de las transacciones de pago.

---

## 3. Decisión — Atributos de Calidad ISO 25010

Se adopta el estándar **ISO/IEC 25010** como marco único para identificar, clasificar y medir los requisitos no funcionales del sistema. Cada atributo se expresa como escenario medible: **Estímulo → Sistema → Respuesta medible**.

---

### QA-01 · Rendimiento — Comportamiento Temporal

| Campo | Detalle |
|---|---|
| **ISO 25010** | Eficiencia de Desempeño |
| **Estímulo** | 1 000 usuarios envían solicitud de itinerario de forma simultánea |
| **Sistema** | Motor de generación de itinerarios (backend + caché Redis) |
| **Respuesta** | Responde en ≤ 2 000 ms (p95). Caché hit evita recálculo. |
| **Métrica** | `p95_latency ≤ 2 000 ms` |
| **Driver** | Objetivo general del proyecto / `Atributo-de-calidad-04` |

---

### QA-02 · Seguridad — Autenticidad (JWT)

| Campo | Detalle |
|---|---|
| **ISO 25010** | Seguridad |
| **Estímulo** | Usuario intenta acceder a un endpoint privado con token inválido o expirado |
| **Sistema** | Middleware de autenticación JWT (HMAC-SHA256) |
| **Respuesta** | Acceso denegado con HTTP 401. Token válido requerido; expiración ≤ 24 h. |
| **Métrica** | `0 accesos con tokens inválidos o expirados` |
| **Driver** | `Driver-funcional-01` / `Atributo-de-calidad-02` |

---

### QA-03 · Seguridad — Control de Acceso RBAC

| Campo | Detalle |
|---|---|
| **ISO 25010** | Seguridad |
| **Estímulo** | Usuario con rol `usuario` intenta ejecutar operación restringida al rol `administrador` |
| **Sistema** | Guards RBAC en capa de controladores + tabla `roles_permisos` (MySQL) |
| **Respuesta** | Acceso denegado con HTTP 403. Sin escalada de privilegios. |
| **Métrica** | `100 % endpoints protegidos, 0 escaladas de privilegio` |
| **Driver** | `Atributo-de-calidad-01` |

---

### QA-04 · Mantenibilidad — Modularidad

| Campo | Detalle |
|---|---|
| **ISO 25010** | Mantenibilidad |
| **Estímulo** | Desarrollador modifica el módulo de alojamiento (`Driver-funcional-04`) |
| **Sistema** | Arquitectura modular por dominio (8 módulos independientes) |
| **Respuesta** | 0 regresiones en módulos no modificados. Acoplamiento ≤ 10 %. |
| **Métrica** | `0 regresiones en módulos no modificados; acoplamiento ≤ 10 %` |
| **Driver** | `Restricción-03` / todos los `Driver-funcional` |

---

### QA-05 · Fiabilidad — Disponibilidad

| Campo | Detalle |
|---|---|
| **ISO 25010** | Fiabilidad |
| **Estímulo** | Fallo inesperado en algún componente del sistema en horario de alta demanda |
| **Sistema** | Health checks + reintentos automáticos con backoff exponencial |
| **Respuesta** | Sistema se recupera y vuelve a operar. MTTR ≤ 4 h. |
| **Métrica** | `uptime ≥ 99,5 % medido mensualmente` |
| **Driver** | `Atributo-de-calidad-04` |

---

### QA-06 · Seguridad — Integridad de Pagos

| Campo | Detalle |
|---|---|
| **ISO 25010** | Seguridad |
| **Estímulo** | Se recibe una solicitud de pago duplicada con el mismo `idempotency_key` |
| **Sistema** | Motor de pagos (ACID MySQL + tabla de auditoría con hash SHA-256) |
| **Respuesta** | Segunda solicitud rechazada. Primera transacción registrada de forma atómica. |
| **Métrica** | `0 transacciones duplicadas o corruptas` |
| **Driver** | `Driver-funcional-07` |

---

## 4. Alternativas Consideradas

- **Alternativa A — ISO 9126:** Estándar predecesor. Descartado porque ISO 25010 lo reemplaza formalmente (2011), ofrece mayor granularidad en sub-características y es el referente vigente en la industria.
- **Alternativa B — Criterios propios del equipo:** Descartado porque sin marco común los criterios son subjetivos y difíciles de medir. ISO 25010 provee terminología estándar con métricas reconocidas y trazables a los drivers del proyecto.

---

## 5. Consecuencias

### ✅ Positivas

- Cada atributo queda vinculado a un driver concreto y a una característica ISO 25010 con métrica objetiva, eliminando ambigüedades.
- Los criterios de aceptación (tiempos en ms, porcentajes de uptime, conteos de errores) son directamente utilizables como criterios de *Done* en cada sprint.
- Identificación temprana de atributos de seguridad evita rediseños costosos en etapas avanzadas.
- El uso de un estándar internacional facilita la comprensión del alcance por cualquier evaluador externo.

### ❌ Negativas / Riesgos

- Cumplir rendimiento y disponibilidad simultáneamente requiere infraestructura adicional (Redis, monitoreo) que compite con `Restricción-02` (cronograma académico).
- Algunos atributos críticos (interoperabilidad con APIs externas, cifrado en reposo) no podrán implementarse en la primera entrega, generando deuda técnica planificada.
- La modularidad estricta exige diseño previo de interfaces entre módulos antes de codificar, lo que puede retrasar el arranque visible del desarrollo.