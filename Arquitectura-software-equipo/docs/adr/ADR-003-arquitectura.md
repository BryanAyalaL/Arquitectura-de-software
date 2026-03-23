# ADR-003: Selección del Patrón Arquitectónico

##  Contexto

El sistema a desarrollar es una aplicación de planificación de viajes que integra funcionalidades como gestión de usuarios, reservas, pagos, transporte y alojamiento.

A partir del ADR-001 se identificaron atributos de calidad clave como:
- Seguridad (validación en < 2 segundos y control de acceso)
- Rendimiento (respuesta en < 2 segundos)
- Disponibilidad (99% uptime)
- Mantenibilidad
- Usabilidad

En el ADR-002 estos atributos fueron priorizados, destacando como Must Have:
- Seguridad
- Rendimiento
- Disponibilidad
- Integridad de datos
- Modularidad

Adicionalmente, el equipo cuenta con:
- Tamaño reducido (3 integrantes)
- Tiempo limitado de desarrollo
- Experiencia básica en tecnologías backend

Se aplicó el cuestionario de selección arquitectónica, obteniendo un puntaje de 5, lo que sugiere el uso de una arquitectura en 3 capas.

---

##  Decisión

Se selecciona la **Arquitectura en 3 Capas** como patrón arquitectónico del sistema.

Esta arquitectura divide el sistema en:

- Capa de Presentación (Frontend)
- Capa de Lógica de Negocio (Backend API)
- Capa de Datos (Base de datos)

---

##  Justificación

La arquitectura en 3 capas permite cumplir con los atributos de calidad priorizados:

- **Mantenibilidad:** separación clara de responsabilidades
- **Seguridad:** centralización de autenticación en la capa de negocio
- **Rendimiento:** control eficiente de peticiones mediante API
- **Disponibilidad:** estructura simple que reduce puntos de falla

Además, esta arquitectura es adecuada para:
- Equipos pequeños
- Proyectos académicos
- Sistemas con dominio centralizado

---

##  Trade-offs

Se identificaron los siguientes compromisos:

- Menor escalabilidad comparado con microservicios
- Mayor acoplamiento en comparación con arquitecturas distribuidas
- Limitación para escalar módulos de forma independiente

---

##  Alternativas Consideradas

### Microservicios 

**Ventajas:**
- Alta escalabilidad
- Despliegue independiente por servicio

**Desventajas:**
- Alta complejidad
- Requiere experiencia avanzada
- Sobrecarga en infraestructura

**Razón de descarte:**
No se ajusta al tamaño del equipo ni al tiempo disponible.

---

##  Relación con el Diagrama C4

La arquitectura seleccionada se refleja en el diagrama de contenedores:

- Frontend → Capa de presentación
- Backend (API) → Capa de negocio
- MySQL → Capa de datos
- Redis → Optimización de rendimiento

---

##  Consecuencias

###  Positivas
- Implementación más rápida
- Facilidad de mantenimiento
- Menor complejidad técnica

###  Negativas
- Escalabilidad limitada a futuro
- Posible crecimiento del monolito

---

##  Conclusión

La arquitectura en 3 capas es la opción más adecuada para este proyecto, ya que equilibra simplicidad, mantenibilidad y cumplimiento de los atributos de calidad definidos.

Esta decisión permite avanzar de forma eficiente en el desarrollo del sistema sin introducir complejidad innecesaria.
