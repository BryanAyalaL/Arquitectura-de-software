# ADR-003: Selección del Patrón Arquitectónico Base

* **Estado:** Aceptado
* **Fecha:** 2026-03-13
* **Autores:** Bryan Ayala Londoño · Juan Esteban Chavarria · Paul Andrés Furnieles Meza

---

## Contexto

¿Cuál es el problema que estamos tratando de resolver? ¿Qué limitaciones o requisitos tenemos?

El equipo debe elegir un único patrón arquitectónico base para el sistema de planificación de viajes con IA. Esta decisión es la más importante del proyecto porque condicionará todas las decisiones técnicas posteriores: estructura de carpetas, forma de integrar la base de datos MySQL, estrategia de pruebas y distribución del trabajo entre los tres integrantes del equipo.

**Respuestas al cuestionario de diseño:**

**¿El equipo tiene experiencia en microservicios?**
No. Los tres integrantes tienen experiencia en desarrollo web con arquitecturas monolíticas y en capas. Ninguno ha desplegado ni operado un sistema basado en microservicios en un entorno real. Implementar microservicios implicaría aprender simultáneamente orquestación de contenedores (Docker/Kubernetes), API Gateway, comunicación entre servicios (REST/mensajería) y gestión de transacciones distribuidas, todo dentro del cronograma académico fijo. El riesgo de no entregar es alto.

**¿El sistema tiene dominios claramente separados?**
Sí. El documento de proyecto define nueve dominios de negocio independientes: identidad/autenticación, reservas, pagos, tours, alojamiento, transporte, actividades, seguros y opiniones. Sin embargo, estos dominios comparten la misma base de datos MySQL y no tienen requisitos de escalado independiente que justifiquen desplegarlos como servicios autónomos en esta fase académica.

**¿Qué indican los atributos Must Have del Lab 2?**
- **Modularidad (RNF-05):** exige módulos independientes por dominio con acoplamiento ≤ 10 %, pero no impone despliegue independiente.
- **Rendimiento (RNF-01):** respuesta ≤ 2 seg; alcanzable con caché y optimización de queries en un monolito bien diseñado.
- **Disponibilidad (RNF-04):** uptime ≥ 99,5 %; más fácil de garantizar en un único proceso que en múltiples servicios distribuidos con un equipo sin experiencia en operaciones.
- **JWT + RBAC (RNF-02/03):** implementables como middleware en cualquier patrón.
- **Integridad de pagos (RNF-06):** las transacciones ACID de MySQL son nativas en un monolito; en microservicios requerirían el patrón Saga, que el equipo no domina.

La combinación de falta de experiencia en sistemas distribuidos, cronograma académico fijo, base de datos MySQL compartida y dominios que necesitan modularidad lógica (no física) apunta hacia un patrón que sea estructurado, testeable y familiar para el equipo.

---

## Decisión

¿Qué solución elegimos y por qué? (Sea específico con tecnologías, patrones o herramientas).

Se elige la **Arquitectura Hexagonal (Puertos y Adaptadores)** como patrón base del sistema.

La arquitectura hexagonal organiza el sistema en tres zonas concéntricas:

- **Núcleo de dominio (Domain):** contiene las entidades de negocio, reglas de dominio y puertos (interfaces). No depende de ninguna tecnología externa. Ejemplo: la entidad `Reserva` con sus reglas de validación y el puerto `IReservaRepository`.
- **Capa de aplicación (Application):** contiene los casos de uso (servicios de aplicación) que orquestan el dominio. Ejemplo: `CrearReservaUseCase`, `ProcesarPagoUseCase`.
- **Adaptadores (Infrastructure / Presentation):** implementaciones concretas de los puertos. Incluye el adaptador de base de datos (MySQL con el ORM elegido), el adaptador HTTP (controladores REST), el adaptador de autenticación (middleware JWT) y futuros adaptadores para APIs externas.

**¿Por qué hexagonal y no las otras opciones?**

Satisface directamente RNF-05 (modularidad): cada dominio tiene su propio núcleo aislado con interfaces explícitas, garantizando acoplamiento ≤ 10 % de forma natural. A diferencia de 3 capas, el núcleo de dominio no depende de la base de datos, lo que facilita las pruebas unitarias sin levantar MySQL (satisface RNF implícito de capacidad de prueba). A diferencia de microservicios, todo se despliega como un único proceso, manteniendo las transacciones ACID nativas de MySQL para los pagos (RNF-06) y simplificando la operación para un equipo sin experiencia en sistemas distribuidos.

**Estructura de módulos resultante:**

```
src/
├── domain/
│   ├── identity/        # entidades: Usuario, Rol; puerto: IUsuarioRepository
│   ├── reservas/        # entidades: Reserva; puerto: IReservaRepository
│   ├── pagos/           # entidades: Pago; puerto: IPagoRepository
│   ├── tours/
│   ├── alojamiento/
│   ├── transporte/
│   ├── actividades/
│   └── seguros/
├── application/
│   ├── identity/        # casos de uso: LoginUseCase, RegistroUseCase
│   ├── reservas/        # casos de uso: CrearReservaUseCase
│   └── pagos/           # casos de uso: ProcesarPagoUseCase
└── infrastructure/
    ├── persistence/     # adaptadores MySQL (repositorios concretos)
    ├── http/            # controladores REST + middleware JWT/RBAC
    └── external/        # adaptadores para APIs de aerolíneas, hoteles
```

---

## Alternativas Consideradas

- **Alternativa A — Arquitectura en 3 Capas (Presentación, Negocio, Datos):** Se descartó porque aunque es familiar para el equipo, la capa de negocio típicamente depende directamente de la capa de datos, lo que dificulta las pruebas unitarias (se necesita una base de datos real para probar cualquier regla de negocio) y tiende a generar acoplamiento alto a medida que el sistema crece. No satisface RNF-05 con la misma solidez que hexagonal.

- **Alternativa B — Microservicios con API Gateway:** Se descartó por tres razones concretas: (1) el equipo no tiene experiencia operando servicios distribuidos; (2) las transacciones ACID de MySQL que garantizan RNF-06 (integridad de pagos) se vuelven transacciones distribuidas que requieren el patrón Saga, añadiendo complejidad que el equipo no puede asumir en el cronograma; (3) la disponibilidad (RNF-04) es más difícil de garantizar cuando depende de que múltiples servicios estén activos simultáneamente.

---

## Consecuencias

### ✅ Positivas

- El núcleo de dominio es independiente de MySQL, lo que permite escribir pruebas unitarias rápidas sin base de datos, facilitando alcanzar la cobertura ≥ 70 % (RNF-10 Should Have).
- Los puertos (interfaces) entre capas garantizan el acoplamiento ≤ 10 % requerido por RNF-05, y cada integrante del equipo puede trabajar en su módulo de dominio sin tocar el código de los otros.
- Añadir nuevos adaptadores externos (una aerolínea nueva, un proveedor de pagos diferente) no requiere modificar el dominio ni los casos de uso, solo implementar un nuevo adaptador en `infrastructure/external/`.
- Las transacciones ACID de MySQL se mantienen nativas en la capa de persistencia, satisfaciendo RNF-06 sin complejidad adicional.
- La estructura es familiar conceptualmente para el equipo (es un monolito organizado) y permite entregar un MVP funcional dentro del cronograma académico.

### ❌ Negativas / Riesgos

- La arquitectura hexagonal tiene una curva de aprendizaje inicial: el equipo deberá invertir tiempo en entender la separación entre puertos e interfaces antes de codificar las primeras funcionalidades.
- Al ser un único proceso desplegado, si en el futuro se requiere escalar independientemente el módulo de reservas del módulo de pagos, será necesario extraerlos a microservicios (migración costosa). Esta deuda arquitectónica es aceptada conscientemente dado el contexto académico.
- Sin disciplina del equipo, es fácil romper las reglas de la arquitectura (por ejemplo, importar un repositorio directamente en el dominio). Se requiere una revisión explícita de dependencias en cada code review.