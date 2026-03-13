# ADR-001: Identificación de Atributos de Calidad (ISO 25010)

* **Estado:** Aceptado
* **Fecha:** 2026-03-13
* **Autores:** Bryan Ayala Londoño · Juan Esteban Chavarria · Paul Andrés Furnieles Meza

---

## Contexto

¿Cuál es el problema que estamos tratando de resolver? ¿Qué limitaciones o requisitos tenemos?

El proyecto consiste en desarrollar un software de planificación de viajes impulsado por inteligencia artificial, capaz de crear itinerarios personalizados ajustados en tiempo real según las preferencias del usuario, condiciones climáticas y disponibilidad, optimizando el tiempo y presupuesto del viajero.

El sistema heredado presenta tres problemas críticos identificados en el documento de proyecto:

- **Manejo manual de reservas:** las agencias dependen de múltiples plataformas para gestionar transporte, alojamiento y actividades, lo que genera errores, duplicaciones y pérdida de tiempo. Motivado por `Driver-funcional-02 (Gestión de reservas)`, `Driver-funcional-04 (Gestión de alojamientos)` y `Driver-funcional-05 (Gestión de transporte)`.
- **Falta de disponibilidad en tiempo real:** sin un sistema centralizado es imposible conocer la disponibilidad actualizada de servicios, lo que lleva a sobreventa o falta de opciones. Relacionado con `Atributo-de-calidad-04 (Disponibilidad de información)`.
- **Sin rastreo de preferencias:** no existe una plataforma que recopile y analice las preferencias del cliente para personalizar recomendaciones. Motivado por `Driver-funcional-06 (Gestión de actividades)` y el objetivo general de IA del proyecto.

Las **restricciones** que acotan el espacio de solución son:

- `Restricción-01` — Motor de base de datos obligatorio: **MySQL**.
- `Restricción-02` — Cronograma académico fijo con entrega por fases.
- `Restricción-03` — Contexto académico que limita tecnologías disponibles y alcance.
- Equipo de tres personas que debe trabajar en paralelo sin bloquearse mutuamente.

Dado este contexto, es necesario identificar y documentar formalmente los atributos de calidad críticos que guiarán todas las decisiones de arquitectura, utilizando el estándar **ISO/IEC 25010** como marco de referencia.

---

## Decisión

¿Qué solución elegimos y por qué? (Sea específico con tecnologías, patrones o herramientas).

Se decide adoptar el estándar **ISO/IEC 25010** como marco único para identificar, clasificar y medir los requisitos no funcionales del sistema. A partir del análisis de los drivers del proyecto, se mapean los siguientes atributos críticos:

**Rendimiento — Comportamiento Temporal (ISO 25010: Eficiencia de Desempeño)**
Motivado por el objetivo general del proyecto (itinerarios ajustados en tiempo real) y `Atributo-de-calidad-04 (Disponibilidad de información)`. El sistema debe responder en menos de 2 segundos (percentil 95) tanto en la generación de itinerarios como en la actualización de disponibilidad. Se implementará mediante caché de recomendaciones (Redis), índices optimizados en MySQL y procesamiento asíncrono. Métrica: `p95_latency ≤ 2 000 ms`.

**Seguridad — Autenticidad (ISO 25010: Seguridad)**
Motivado directamente por `Driver-funcional-01 (Autenticación y gestión de identidad)` y `Atributo-de-calidad-02 (Seguridad en autenticación)`. Autenticación mediante tokens JWT firmados con HMAC-SHA256, expiración ≤ 24 horas y rotación de refresh tokens. Un middleware central validará el 100 % de los endpoints privados. Métrica: `0 accesos con tokens inválidos o expirados`.

**Seguridad — Control de Acceso RBAC (ISO 25010: Seguridad)**
Motivado por `Atributo-de-calidad-01 (Seguridad / control de acceso por roles)`. Los tres roles definidos en el proyecto (administrador, gerente, usuario) tendrán permisos diferenciados, implementados mediante guards en la capa de controladores y una tabla `roles_permisos` en MySQL. Métrica: `100 % de endpoints protegidos, 0 escaladas de privilegio`.

**Mantenibilidad — Modularidad (ISO 25010: Mantenibilidad)**
Motivado por `Restricción-03 (contexto académico)` y la necesidad de desarrollo paralelo del equipo. El código se organizará en módulos independientes por dominio de negocio cubriendo todos los drivers funcionales: identidad (`Driver-funcional-01`), reservas (`Driver-funcional-02`), tours (`Driver-funcional-03`), alojamiento (`Driver-funcional-04`), transporte (`Driver-funcional-05`), actividades (`Driver-funcional-06`), pagos (`Driver-funcional-07`) y seguros (`Driver-funcional-08`). Acoplamiento ≤ 10 %. Métrica: `0 regresiones en módulos no modificados`.

**Fiabilidad — Disponibilidad (ISO 25010: Fiabilidad)**
Motivado por `Atributo-de-calidad-04 (Disponibilidad de información)` y la naturaleza 24/7 de una plataforma de reservas activas. El sistema debe mantener un uptime mensual ≥ 99,5 % con MTTR ≤ 4 horas, implementado con health checks y reintentos automáticos con backoff exponencial. Métrica: `uptime ≥ 99,5 % medido mensualmente`.

**Seguridad — Integridad de Pagos (ISO 25010: Seguridad)**
Motivado por `Driver-funcional-07 (Gestión de pagos)`. Todas las transacciones de pago deben ser atómicas (ACID en `Restricción-01 MySQL`), idempotentes mediante `idempotency_key` único y auditadas en una tabla inmutable con hash SHA-256. Métrica: `0 transacciones duplicadas o corruptas`.

---

## Alternativas Consideradas

- **Alternativa A — Usar ISO 9126 en lugar de ISO 25010:** ISO 9126 es el estándar predecesor; se descartó porque ISO 25010 (2011) lo reemplaza formalmente, ofrece mayor granularidad en sub-características (por ejemplo, separa autenticidad e integridad dentro de seguridad, alineándose con `Atributo-de-calidad-01` y `Atributo-de-calidad-02` del proyecto) y es el referente vigente en la industria.

- **Alternativa B — Definir atributos de calidad sin estándar formal (criterios propios del equipo):** Se descartó porque sin un marco común los criterios serían subjetivos y difíciles de medir; ISO 25010 provee terminología estándar y métricas reconocidas que permiten trazar cada atributo directamente a los drivers del proyecto.

---

## Consecuencias

### ✅ Positivas

- Cada atributo de calidad queda vinculado a un driver concreto del proyecto (`Driver-funcional`, `Atributo-de-calidad` o `Restricción`) y a una característica ISO 25010 con métrica objetiva, eliminando ambigüedades en las revisiones de entrega.
- El mapeo explícito de drivers permite priorizar atributos en el Laboratorio 2 (ADR-002) con criterios justificados y trazables al documento de proyecto.
- Usar un estándar internacional facilita que cualquier integrante del equipo, el docente o un evaluador externo comprenda el alcance de cada requisito sin necesidad de contexto adicional.
- Los criterios de aceptación definidos (tiempos en ms, porcentajes de uptime, conteos de errores) son directamente utilizables como criterios de `Done` en cada sprint.
- La identificación temprana de los atributos de seguridad derivados de `Driver-funcional-01`, `Atributo-de-calidad-01` y `Atributo-de-calidad-02` evita rediseños costosos en etapas avanzadas.

### ❌ Negativas / Riesgos

- Cumplir simultáneamente el atributo de rendimiento y disponibilidad requiere infraestructura adicional (Redis, monitoreo) que compite con el tiempo disponible en `Restricción-02 (cronograma académico)`.
- Algunos atributos identificados como críticos (interoperabilidad con APIs externas, cifrado en reposo) no podrán implementarse en la primera entrega, generando deuda técnica planificada.
- La modularidad estricta exige un diseño previo de interfaces entre los módulos de cada `Driver-funcional` antes de comenzar a codificar, lo que puede retrasar el arranque visible del desarrollo.
- El estándar ISO 25010 no prescribe cómo medir `Atributo-de-calidad-03 (Usabilidad)`; el equipo deberá definir sus propias herramientas y metodologías de medición.