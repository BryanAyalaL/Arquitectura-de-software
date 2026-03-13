# ADR-002: Atributos de Calidad Must Have

* **Estado:** Aceptado
* **Fecha:** 2026-03-13
* **Autores:** Bryan Ayala Londoño · Juan Esteban Chavarria · Paul Andrés Furnieles Meza

## Contexto

El sistema de planificación de viajes con IA gestiona datos personales, financieros y de reservas de múltiples usuarios con roles diferenciados (administrador, gerente, usuario). Debe generar itinerarios personalizados en tiempo real integrándose con servicios externos (aerolíneas, hoteles, actividades) y operar bajo un cronograma académico fijo con un equipo de tres personas.

En el Laboratorio 1 se identificaron 19 requisitos no funcionales mapeados al estándar ISO/IEC 25010. La priorización MoSCoW del Laboratorio 2 determinó que seis de ellos son **obligatorios**: sin satisfacerlos el sistema no puede entregarse ni operar correctamente. Las restricciones concretas son:

- **Tecnológica:** motor de base de datos MySQL obligatorio (Driver-14 del proyecto).
- **Temporal:** cronograma académico fijo; el equipo no puede asumir reprocesos por decisiones erróneas de arquitectura.
- **Funcional:** el sistema maneja pagos reales, autenticación de usuarios y reservas activas; errores de seguridad o integridad tienen consecuencias económicas y legales.
- **Operativa:** una plataforma de reservas de viajes debe estar disponible 24/7; caídas prolongadas afectan reservas en curso.

## Decisión

Se adoptan los siguientes **seis atributos de calidad como Must Have**, cada uno vinculado a una táctica arquitectónica concreta:

**1. Rendimiento — Respuesta ≤ 2 segundos (ISO 25010: Eficiencia de Desempeño)**
El sistema debe responder en ≤ 2 000 ms (p95) en generación de itinerarios y actualizaciones de disponibilidad. Se implementará mediante caché de recomendaciones con Redis, índices optimizados en MySQL y procesamiento asíncrono no bloqueante.

**2. Seguridad — Autenticación con JWT (ISO 25010: Autenticidad)**
Toda autenticación usará tokens JWT firmados con HMAC-SHA256, expiración ≤ 24 h y rotación de refresh tokens. Un middleware de validación central protegerá el 100 % de los endpoints privados.

**3. Seguridad — Control de acceso RBAC (ISO 25010: Control de Acceso)**
Los tres roles definidos en el proyecto (administrador, gerente, usuario) tendrán permisos diferenciados implementados mediante guards en la capa de controladores y una tabla `roles_permisos` en MySQL, siguiendo el principio de mínimo privilegio.

**4. Fiabilidad — Disponibilidad ≥ 99,5 % (ISO 25010: Disponibilidad)**
Se garantizará un uptime mensual ≥ 99,5 % (máx. 3,6 h de inactividad) y MTTR ≤ 4 h mediante health checks periódicos, reintentos con backoff exponencial y monitoreo activo.

**5. Mantenibilidad — Módulos independientes por dominio (ISO 25010: Modularidad)**
El código se organizará en módulos desacoplados por dominio de negocio: identidad, reservas, pagos, tours, alojamiento, transporte, actividades y seguros. El acoplamiento entre módulos no superará el 10 %, verificado en cada code review mediante métricas de dependencias.

**6. Seguridad — Integridad de pagos (ISO 25010: Integridad)**
Todas las transacciones de pago serán atómicas (ACID en MySQL), idempotentes mediante `idempotency_key` único por operación, y auditadas en una tabla inmutable con hash SHA-256. La meta es 0 transacciones duplicadas o corruptas.

## Alternativas Consideradas

- **Alternativa A — Priorizar usabilidad como Must Have en lugar de modularidad:** Se descartó porque la usabilidad puede mejorarse iterativamente en cada sprint, mientras que la falta de modularidad desde el inicio bloquea el desarrollo paralelo del equipo y genera conflictos de integración irrecuperables dentro del cronograma.

- **Alternativa B — Incluir interoperabilidad con APIs externas como Must Have:** Se descartó porque los módulos core (reservas, pagos, autenticación) pueden desarrollarse con datos mock antes de conectar servicios externos reales; promoverla a Must Have agrega dependencias externas que podrían bloquear etapas tempranas.

- **Alternativa C — Relajar disponibilidad al 99 % mensual:** Se descartó porque 99 % permite hasta 7,2 horas de inactividad mensual, inaceptable para una plataforma con reservas activas; el costo de implementar health checks y reintentos es bajo comparado con el riesgo de pérdida de reservas.

- **Alternativa D — Autenticación por sesión (cookies) en lugar de JWT:** Se descartó porque el sistema expone una API stateless consumida potencialmente por clientes móviles y de terceros; las sesiones en servidor añaden estado que complica la escalabilidad horizontal.

## Consecuencias

### ✅ Positivas
- Los seis atributos establecen criterios de aceptación objetivos y medibles desde el primer sprint, reduciendo ambigüedades en revisiones de entrega.
- JWT y RBAC permiten una arquitectura stateless que facilita escalar horizontalmente sin compartir estado de sesión entre instancias.
- La modularidad por dominio habilita el trabajo paralelo del equipo sin bloqueos mutuos y simplifica las pruebas unitarias por módulo aislado.
- Las transacciones ACID con idempotency keys protegen la integridad financiera y generan un log de auditoría completo sin esfuerzo adicional.
- Documentar estas decisiones formalmente reduce el riesgo de regresiones arquitectónicas al incorporar nuevas funcionalidades.

### ❌ Negativas / Riesgos
- Satisfacer rendimiento (≤ 2 seg) y disponibilidad (99,5 %) simultáneamente requiere configurar infraestructura adicional (Redis, monitoreo) que consume tiempo del cronograma académico.
- El RBAC añade complejidad a la capa de controladores; cualquier cambio en la lógica de roles requiere actualizar código y tabla de permisos en base de datos.
- La modularidad estricta exige invertir tiempo en diseño de interfaces entre módulos antes de codificar, lo que puede percibirse como trabajo sin resultados visibles en las primeras semanas.
- Los cinco atributos **Should Have** (interoperabilidad, tolerancia a fallos, usabilidad medida, cobertura ≥ 70 %, cifrado en reposo) quedan como deuda técnica planificada a abordar en iteraciones posteriores.
- Si la carga real supera las estimaciones de diseño, el umbral de 2 segundos puede no cumplirse sin rediseñar la estrategia de caché, lo que representa un riesgo de rendimiento en producción.