# ADR-003: Selección del Patrón Arquitectónico Base

* **Estado:** Aceptado
* **Fecha:** 2026-03-13
* **Autores:** Bryan Ayala Londoño · Juan Esteban Chavarria · Paul Andrés Furnieles Meza

---

## Contexto

¿Cuál es el problema que estamos tratando de resolver? ¿Qué limitaciones o requisitos tenemos?

El equipo debe elegir un único patrón arquitectónico base que soporte todos los drivers del proyecto y sea viable dentro de las restricciones académicas. Esta decisión condiciona la estructura de carpetas, la estrategia de pruebas, la forma de integrar `Restricción-01 (MySQL)` y la distribución del trabajo entre los tres integrantes.

**Respuestas al cuestionario de diseño:**

**¿El equipo tiene experiencia en microservicios?**
No. Los tres integrantes tienen experiencia en arquitecturas monolíticas y en capas. Implementar microservicios implicaría aprender orquestación de contenedores, API Gateway, comunicación entre servicios y transacciones distribuidas dentro de `Restricción-02 (cronograma académico fijo)`. El riesgo de no entregar es alto, especialmente para garantizar `Driver-funcional-07 (Gestión de pagos)` con integridad ACID, que en microservicios requeriría el patrón Saga.

**¿El sistema tiene dominios claramente separados?**
Sí. El documento de proyecto define nueve dominios independientes trazados a drivers funcionales concretos: `Driver-funcional-01` (identidad), `Driver-funcional-02` (reservas), `Driver-funcional-03` (tours), `Driver-funcional-04` (alojamiento), `Driver-funcional-05` (transporte), `Driver-funcional-06` (actividades), `Driver-funcional-07` (pagos), `Driver-funcional-08` (seguros) y `Driver-funcional-09` (opiniones). Sin embargo, estos dominios comparten `Restricción-01 (MySQL)` y no tienen requisitos de escalado independiente que justifiquen desplegarlos como servicios autónomos.

**¿Qué indican los atributos Must Have del ADR-002?**
- `RNF-05 — Modularidad` (derivado de cubrir todos los `Driver-funcional`): exige módulos independientes con acoplamiento ≤ 10 %, pero no impone despliegue independiente.
- `RNF-01 — Rendimiento`: respuesta ≤ 2 seg; alcanzable con caché y queries optimizadas en un monolito bien diseñado sobre `Restricción-01 MySQL`.
- `RNF-04 — Disponibilidad` (derivado de `Atributo-de-calidad-04`): uptime ≥ 99,5 %; más fácil de garantizar en un único proceso que en múltiples servicios distribuidos con un equipo sin experiencia operacional.
- `RNF-02/03 — JWT + RBAC` (derivados de `Driver-funcional-01` y `Atributo-de-calidad-01/02`): implementables como middleware en cualquier patrón.
- `RNF-06 — Integridad de pagos` (derivado de `Driver-funcional-07`): las transacciones ACID de `Restricción-01 MySQL` son nativas en un monolito; en microservicios requerirían patrón Saga.

---

## Decisión

¿Qué solución elegimos y por qué? (Sea específico con tecnologías, patrones o herramientas).

Se elige la **Arquitectura Hexagonal (Puertos y Adaptadores)** como patrón base del sistema.

La arquitectura hexagonal organiza el sistema en tres zonas concéntricas que mapean directamente a los drivers del proyecto:

- **Núcleo de dominio (Domain):** contiene las entidades de negocio y reglas de dominio de cada `Driver-funcional`, y los puertos (interfaces). No depende de ninguna tecnología externa ni de `Restricción-01 MySQL`. Ejemplo: entidad `Reserva` con sus reglas de validación (`Driver-funcional-02`) y el puerto `IReservaRepository`.
- **Capa de aplicación (Application):** contiene los casos de uso que orquestan el dominio para cada driver. Ejemplo: `CrearReservaUseCase` (`Driver-funcional-02`), `ProcesarPagoUseCase` (`Driver-funcional-07`), `LoginUseCase` (`Driver-funcional-01`).
- **Adaptadores (Infrastructure / Presentation):** implementaciones concretas de los puertos. Incluye el adaptador de base de datos (`Restricción-01 MySQL`), el adaptador HTTP (controladores REST), el middleware JWT/RBAC (`Atributo-de-calidad-01/02`) y futuros adaptadores para APIs externas (`Driver-funcional-03` a `Driver-funcional-06`).

Este patrón satisface directamente `RNF-05 (Modularidad)` porque cada `Driver-funcional` tiene su propio núcleo aislado con interfaces explícitas. A diferencia de 3 capas, el dominio no depende de `Restricción-01 MySQL`, lo que permite pruebas unitarias sin base de datos (apoya `RNF-10 Should Have — cobertura ≥ 70 %`). A diferencia de microservicios, todo se despliega como un único proceso, manteniendo las transacciones ACID nativas para `Driver-funcional-07` y siendo operable por un equipo sin experiencia distribuida dentro de `Restricción-02`.

**Estructura de módulos resultante (un módulo por driver funcional):**

```
src/
├── domain/
│   ├── identity/        # Driver-funcional-01: Usuario, Rol; IUsuarioRepository
│   ├── reservas/        # Driver-funcional-02: Reserva; IReservaRepository
│   ├── pagos/           # Driver-funcional-07: Pago; IPagoRepository
│   ├── tours/           # Driver-funcional-03
│   ├── alojamiento/     # Driver-funcional-04
│   ├── transporte/      # Driver-funcional-05
│   ├── actividades/     # Driver-funcional-06
│   ├── seguros/         # Driver-funcional-08
│   └── opiniones/       # Driver-funcional-09
├── application/
│   ├── identity/        # LoginUseCase, RegistroUseCase, RecuperarPasswordUseCase
│   ├── reservas/        # CrearReservaUseCase, ModificarReservaUseCase, CancelarReservaUseCase
│   └── pagos/           # ProcesarPagoUseCase (ACID via Restricción-01)
└── infrastructure/
    ├── persistence/     # Adaptadores MySQL (Restricción-01) por dominio
    ├── http/            # Controladores REST + middleware JWT (RNF-02) + RBAC (RNF-03)
    └── external/        # Adaptadores para APIs de aerolíneas, hoteles, actividades
```

---

## Alternativas Consideradas

- **Alternativa A — Arquitectura en 3 Capas (Presentación, Negocio, Datos):** Se descartó porque aunque es familiar para el equipo, la capa de negocio típicamente depende de la capa de datos, lo que obliga a levantar `Restricción-01 MySQL` para probar cualquier regla de dominio de los `Driver-funcional`. No satisface `RNF-05 (Modularidad)` con la misma solidez que hexagonal y tiende a generar acoplamiento alto a medida que los nueve dominios crecen.

- **Alternativa B — Microservicios con API Gateway:** Se descartó por tres razones trazadas a drivers concretos: (1) el equipo no tiene experiencia operando servicios distribuidos, lo que pone en riesgo `Restricción-02 (cronograma)`; (2) `Driver-funcional-07 (Gestión de pagos)` requeriría patrón Saga para mantener integridad ACID al no poder usar transacciones nativas de `Restricción-01 MySQL`; (3) `RNF-04 (Disponibilidad ≥ 99,5 %)` es más difícil de garantizar cuando depende de que múltiples servicios estén activos simultáneamente.

---

## Consecuencias

### ✅ Positivas

- El núcleo de dominio es independiente de `Restricción-01 MySQL`, permitiendo pruebas unitarias rápidas sin base de datos y facilitando alcanzar `RNF-10 Should Have (cobertura ≥ 70 %)`.
- Los puertos entre capas garantizan el acoplamiento ≤ 10 % requerido por `RNF-05`, y cada integrante del equipo puede trabajar en el módulo de su `Driver-funcional` asignado sin tocar el código de los otros.
- Añadir nuevos adaptadores externos para `Driver-funcional-03` a `Driver-funcional-06` (aerolíneas, hoteles, actividades) no requiere modificar el dominio ni los casos de uso, solo implementar un nuevo adaptador en `infrastructure/external/`.
- Las transacciones ACID de `Restricción-01 MySQL` se mantienen nativas en la capa de persistencia, satisfaciendo `RNF-06 (Integridad de pagos)` de `Driver-funcional-07` sin complejidad adicional.
- La estructura es un monolito organizado, entregable dentro de `Restricción-02 (cronograma académico)` por un equipo sin experiencia en sistemas distribuidos.

### ❌ Negativas / Riesgos

- La arquitectura hexagonal tiene una curva de aprendizaje inicial: el equipo deberá invertir tiempo en entender la separación de puertos e interfaces antes de codificar los primeros `Driver-funcional`, compitiendo con `Restricción-02`.
- Si en el futuro se requiere escalar independientemente `Driver-funcional-02 (reservas)` de `Driver-funcional-07 (pagos)`, será necesario extraerlos a microservicios (migración costosa). Esta deuda arquitectónica es aceptada conscientemente dado `Restricción-03 (contexto académico)`.
- Sin disciplina del equipo es fácil romper las reglas importando un repositorio directamente en el dominio. Se requiere revisión explícita de dependencias en cada code review para proteger `RNF-05`.