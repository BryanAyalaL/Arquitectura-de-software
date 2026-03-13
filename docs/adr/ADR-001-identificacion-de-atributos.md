# ADR-001: Identificación de Atributos de Calidad (ISO 25010)

* **Estado:** Aceptado
* **Fecha:** 2026-03-13
* **Autores:** Bryan Ayala Londoño · Juan Esteban Chavarria · Paul Andrés Furnieles Meza

---

## Contexto

¿Cuál es el problema que estamos tratando de resolver? ¿Qué limitaciones o requisitos tenemos?

El proyecto consiste en desarrollar un software de planificación de viajes impulsado por inteligencia artificial, capaz de crear itinerarios personalizados ajustados en tiempo real según las preferencias del usuario, condiciones climáticas y disponibilidad, optimizando el tiempo y presupuesto del viajero.

El sistema heredado presenta tres problemas críticos identificados en el documento de proyecto:

- **Manejo manual de reservas:** las agencias dependen de múltiples plataformas para gestionar transporte, alojamiento y actividades, lo que genera errores, duplicaciones y pérdida de tiempo.
- **Falta de disponibilidad en tiempo real:** sin un sistema centralizado, es imposible conocer la disponibilidad actualizada de servicios, lo que lleva a sobreventa o falta de opciones.
- **Sin rastreo de preferencias:** no existe una plataforma que recopile y analice las preferencias del cliente para personalizar recomendaciones.

Las **restricciones** del proyecto son:

- Motor de base de datos obligatorio: **MySQL** (Driver-14).
- Cronograma académico fijo con entrega por fases.
- Contexto académico que limita tecnologías disponibles y alcance.
- Equipo de tres personas que debe trabajar en paralelo sin bloquearse mutuamente.

Dado este contexto, es necesario identificar y documentar formalmente los atributos de calidad críticos que guiarán todas las decisiones de arquitectura, utilizando el estándar **ISO/IEC 25010** como marco de referencia.

---

## Decisión

¿Qué solución elegimos y por qué? (Sea específico con tecnologías, patrones o herramientas).

Se decide adoptar el estándar **ISO/IEC 25010** como marco único para identificar, clasificar y medir los requisitos no funcionales del sistema. A partir del análisis del documento de proyecto, se mapean los siguientes atributos críticos:

**Rendimiento — Comportamiento Temporal (ISO 25010: Eficiencia de Desempeño)**
El sistema debe responder en menos de 2 segundos (percentil 95) tanto en la generación de itinerarios personalizados como en la actualización de disponibilidad en tiempo real. Se implementará mediante caché de recomendaciones (Redis), índices optimizados en MySQL y procesamiento asíncrono. Métrica: `p95_latency ≤ 2 000 ms`.

**Seguridad — Autenticidad (ISO 25010: Seguridad)**
Autenticación mediante tokens JWT firmados con HMAC-SHA256, expiración configurada a ≤ 24 horas y rotación de refresh tokens. Un middleware central validará el 100 % de los endpoints privados. Métrica: `0 accesos con tokens inválidos o expirados`.

**Seguridad — Control de Acceso RBAC (ISO 25010: Seguridad)**
Los tres roles definidos en el proyecto (administrador, gerente, usuario) tendrán permisos diferenciados. Se implementará mediante guards en la capa de controladores y una tabla `roles_permisos` en MySQL. Métrica: `100 % de endpoints protegidos, 0 escaladas de privilegio`.

**Mantenibilidad — Modularidad (ISO 25010: Mantenibilidad)**
El código se organizará en módulos independientes por dominio de negocio: identidad, reservas, pagos, tours, alojamiento, transporte, actividades y seguros. Acoplamiento entre módulos ≤ 10 %, verificado en cada code review. Métrica: `0 regresiones en módulos no modificados`.

**Fiabilidad — Disponibilidad (ISO 25010: Fiabilidad)**
El sistema debe mantener un uptime mensual ≥ 99,5 % (máximo 3,6 horas de inactividad no planificada por mes) con MTTR ≤ 4 horas. Se implementará con health checks, reintentos automáticos con backoff exponencial y monitoreo activo. Métrica: `uptime ≥ 99,5 % medido mensualmente`.

**Seguridad — Integridad de Pagos (ISO 25010: Seguridad)**
Todas las transacciones de pago deben ser atómicas (ACID en MySQL), idempotentes mediante `idempotency_key` único y auditadas en una tabla inmutable con hash SHA-256. Métrica: `0 transacciones duplicadas o corruptas`.

---

## Alternativas Consideradas

- **Alternativa A — Usar ISO 9126 en lugar de ISO 25010:** ISO 9126 es el estándar predecesor; se descartó porque ISO 25010 (2011) lo reemplaza formalmente, ofrece mayor granularidad en sub-características (por ejemplo, separa autenticidad e integridad dentro de seguridad) y es el referente vigente en la industria para evaluación de calidad de software.

- **Alternativa B — Definir atributos de calidad sin estándar formal (criterios propios del equipo):** Se descartó porque sin un marco común los criterios serían subjetivos, difíciles de medir y no comparables entre proyectos; ISO 25010 provee terminología estándar, métricas reconocidas y facilita la comunicación con el docente y con futuros equipos de mantenimiento.

---

## Consecuencias

### ✅ Positivas

- Cada atributo de calidad queda vinculado a una característica ISO 25010 con nombre, sub-característica y métrica de aceptación objetiva, eliminando ambigüedades en las revisiones de entrega.
- El mapeo explícito permite priorizar atributos en el Laboratorio 2 con criterios justificados y trazables al documento de proyecto.
- Usar un estándar internacional facilita que cualquier integrante del equipo, el docente o un evaluador externo comprenda el alcance de cada requisito no funcional sin necesidad de contexto adicional.
- Los criterios de aceptación definidos (tiempos en ms, porcentajes de uptime, conteos de errores) son directamente utilizables como criterios de `Done` en cada sprint.
- La identificación temprana de los atributos de seguridad (JWT, RBAC, integridad de pagos) evita rediseños costosos en etapas avanzadas del proyecto.

### ❌ Negativas / Riesgos

- Cumplir simultáneamente los atributos de rendimiento (≤ 2 seg) y disponibilidad (99,5 %) requiere inversión en infraestructura y configuración (Redis, monitoreo) que compite con el tiempo disponible en el cronograma académico.
- Algunos atributos identificados como críticos (interoperabilidad con APIs externas, cifrado en reposo) no podrán implementarse en la primera entrega, generando deuda técnica planificada que debe gestionarse explícitamente en iteraciones posteriores.
- La modularidad estricta exige un diseño previo de interfaces entre módulos antes de comenzar a codificar, lo que puede retrasar el arranque visible del desarrollo.
- El estándar ISO 25010 no prescribe cómo medir algunos atributos (como usabilidad); el equipo deberá definir sus propias herramientas y metodologías de medición, lo que añade trabajo de preparación.