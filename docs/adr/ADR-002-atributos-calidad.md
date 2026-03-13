# ADR-002: Atributos de Calidad Must Have

* **Estado:** Aceptado
* **Fecha:** 2026-03-13
* **Autores:** Bryan Ayala Londoño · Juan Esteban Chavarria · Paul Andrés Furnieles Meza

---

## Contexto

¿Cuál es el problema que estamos tratando de resolver? ¿Qué limitaciones o requisitos tenemos?

De los 19 requisitos no funcionales identificados en ADR-001, el equipo debe determinar cuáles son obligatorios para que el sistema pueda entregarse y operar correctamente. La priorización parte directamente de los drivers del proyecto:

- `Driver-funcional-01` (Autenticación y gestión de identidad) y `Atributo-de-calidad-01/02` (control de acceso y seguridad en autenticación) hacen que la seguridad sea innegociable desde el primer sprint.
- `Driver-funcional-02` a `Driver-funcional-09` (reservas, tours, alojamiento, transporte, actividades, pagos, seguros, opiniones) cubren nueve dominios que deben desarrollarse en paralelo, lo que convierte la modularidad en un requisito estructural del equipo.
- `Driver-funcional-07` (Gestión de pagos) maneja dinero real; cualquier error de integridad tiene consecuencias económicas y legales.
- `Atributo-de-calidad-04` (Disponibilidad de información) y la naturaleza 24/7 de una plataforma de reservas hacen que la disponibilidad sea crítica para la operación.
- `Restricción-01` (MySQL) y `Restricción-02` (cronograma académico fijo) acotan el espacio de solución: no se pueden asumir reprocesos por decisiones erróneas.

---

## Decisión

¿Qué solución elegimos y por qué? (Sea específico con tecnologías, patrones o herramientas).

Se adoptan los siguientes **seis atributos de calidad como Must Have**, cada uno trazado a sus drivers y vinculado a una táctica arquitectónica concreta:

**1. Rendimiento — Respuesta ≤ 2 segundos (ISO 25010: Eficiencia de Desempeño)**
Driver: objetivo general del proyecto + `Atributo-de-calidad-04`. El sistema debe responder en ≤ 2 000 ms (p95) en generación de itinerarios y actualizaciones de disponibilidad. Táctica: caché con Redis, índices optimizados en `Restricción-01 MySQL`, procesamiento asíncrono no bloqueante.

**2. Seguridad — Autenticación con JWT (ISO 25010: Autenticidad)**
Driver: `Driver-funcional-01 (Autenticación y gestión de identidad)` + `Atributo-de-calidad-02 (Seguridad en autenticación)`. Tokens JWT firmados HMAC-SHA256, expiración ≤ 24 h, rotación de refresh tokens. Middleware central protege el 100 % de los endpoints privados.

**3. Seguridad — Control de Acceso RBAC (ISO 25010: Control de Acceso)**
Driver: `Atributo-de-calidad-01 (Seguridad / control de acceso por roles)`. Los tres roles del proyecto (administrador, gerente, usuario) con permisos diferenciados mediante guards en controladores y tabla `roles_permisos` en MySQL. Principio de mínimo privilegio aplicado en todos los endpoints.

**4. Fiabilidad — Disponibilidad ≥ 99,5 % (ISO 25010: Disponibilidad)**
Driver: `Atributo-de-calidad-04 (Disponibilidad de información)` + `Driver-funcional-02 (Gestión de reservas)`. Uptime mensual ≥ 99,5 % (máx. 3,6 h de inactividad) y MTTR ≤ 4 h. Táctica: health checks periódicos, reintentos con backoff exponencial, monitoreo activo.

**5. Mantenibilidad — Módulos independientes por dominio (ISO 25010: Modularidad)**
Driver: `Restricción-03 (contexto académico)` + todos los `Driver-funcional-01` a `Driver-funcional-09`. Un módulo por driver funcional: identidad, reservas, tours, alojamiento, transporte, actividades, pagos, seguros y opiniones. Acoplamiento ≤ 10 % verificado en cada code review.

**6. Seguridad — Integridad de Pagos (ISO 25010: Integridad)**
Driver: `Driver-funcional-07 (Gestión de pagos)`. Transacciones atómicas (ACID en `Restricción-01 MySQL`), `idempotency_key` único por operación, tabla de auditoría inmutable con hash SHA-256. Meta: 0 transacciones duplicadas o corruptas.

---

## Alternativas Consideradas

- **Alternativa A — Priorizar usabilidad (`Atributo-de-calidad-03`) como Must Have en lugar de modularidad:** Se descartó porque la usabilidad puede mejorarse iterativamente en cada sprint, mientras que sin modularidad desde el inicio los nueve dominios de `Driver-funcional-01` a `Driver-funcional-09` generarían conflictos de integración irrecuperables dentro de `Restricción-02 (cronograma)`.

- **Alternativa B — Incluir interoperabilidad con APIs externas como Must Have:** Se descartó porque `Driver-funcional-02` a `Driver-funcional-06` pueden desarrollarse con datos mock antes de conectar servicios externos reales; promoverla a Must Have agrega dependencias que bloquearían el desarrollo del core en etapas tempranas.

- **Alternativa C — Relajar disponibilidad al 99 % mensual:** Se descartó porque 99 % permite hasta 7,2 h de inactividad mensual, inaceptable para `Driver-funcional-02 (Gestión de reservas)` con reservas activas; el costo de implementar health checks es bajo comparado con el riesgo.

- **Alternativa D — Autenticación por sesión (cookies) en lugar de JWT:** Se descartó porque `Driver-funcional-01` exige una API stateless consumible por clientes móviles y de terceros; las sesiones en servidor añaden estado que complica la escalabilidad horizontal.

---

## Consecuencias

### ✅ Positivas

- Cada Must Have está trazado a al menos un driver del proyecto (`Driver-funcional`, `Atributo-de-calidad` o `Restricción`), lo que justifica su obligatoriedad de forma objetiva ante el docente y el equipo.
- JWT y RBAC derivados de `Driver-funcional-01` y `Atributo-de-calidad-01/02` permiten una arquitectura stateless que facilita la escalabilidad horizontal.
- La modularidad por dominio, derivada de cubrir todos los `Driver-funcional`, habilita el trabajo paralelo del equipo sin bloqueos mutuos.
- Las transacciones ACID de `Restricción-01 MySQL` con idempotency keys protegen `Driver-funcional-07` sin complejidad adicional de sistemas distribuidos.
- Documentar la trazabilidad driver → atributo → táctica reduce el riesgo de regresiones arquitectónicas al incorporar nuevas funcionalidades.

### ❌ Negativas / Riesgos

- Satisfacer rendimiento y disponibilidad simultáneamente requiere infraestructura adicional (Redis, monitoreo) que compite con `Restricción-02 (cronograma académico)`.
- El RBAC derivado de `Atributo-de-calidad-01` añade complejidad a los controladores; cambios en la lógica de roles requieren actualizar código y la tabla de permisos en `Restricción-01 MySQL`.
- La modularidad estricta para cubrir `Driver-funcional-01` a `Driver-funcional-09` exige diseñar interfaces entre módulos antes de codificar, lo que puede percibirse como trabajo sin resultados visibles en las primeras semanas.
- Los cinco atributos Should Have (interoperabilidad, tolerancia a fallos, usabilidad, cobertura ≥ 70 %, cifrado en reposo) quedan como deuda técnica planificada para iteraciones posteriores.
- Si la carga real supera las estimaciones, el umbral de 2 segundos puede no cumplirse sin rediseñar la estrategia de caché, representando un riesgo de rendimiento en producción.