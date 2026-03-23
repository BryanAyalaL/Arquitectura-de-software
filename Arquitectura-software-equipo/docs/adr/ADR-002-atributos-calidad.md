# ADR-002: Priorización de Atributos de Calidad (Matriz MoSCoW)

##  Contexto

A partir del ADR-001 se identificaron los atributos de calidad del sistema de planificación de viajes, definidos mediante escenarios medibles.

Estos atributos surgen de los principales problemas del sistema actual:

- Procesos manuales en la gestión de reservas
- Falta de información en tiempo real
- Baja personalización del servicio

El objetivo de este ADR es priorizar dichos atributos utilizando la técnica MoSCoW, para determinar cuáles impactarán directamente en la arquitectura del sistema.

---

##  Decisión

Se clasificaron los atributos de calidad en categorías Must Have, Should Have y Could Have, basados en su impacto en el sistema.

---

###  Must Have (Obligatorios)

| Atributo | Justificación |
|----------|--------------|
| Seguridad | El sistema debe validar credenciales en menos de 2 segundos y bloquear el acceso tras 3 intentos fallidos para proteger la información de los usuarios |
| Control de acceso (RBAC) | Existen múltiples roles (administrador, gerente, usuario) que requieren restricciones claras de acceso |
| Integridad de datos | El sistema gestiona pagos y reservas, por lo que los datos deben ser consistentes y confiables |
| Disponibilidad | El sistema debe garantizar al menos un 99% de disponibilidad para asegurar acceso continuo |
| Rendimiento | El sistema debe responder en menos de 2 segundos incluso con múltiples usuarios concurrentes |
| Modularidad | Permite que el equipo trabaje en diferentes módulos sin afectar el sistema completo |

---

### 🟨 Should Have (Importantes)

| Atributo | Justificación |
|----------|--------------|
| Logging | Permite registrar eventos y errores para facilitar el mantenimiento del sistema |
| Observabilidad | Permite monitorear el comportamiento del sistema en tiempo real |
| Usabilidad | Permite que los usuarios realicen tareas como reservas en menos de 5 minutos |

---

###  Could Have (Deseables)

| Atributo | Justificación |
|----------|--------------|
| Recomendaciones avanzadas | Mejora la experiencia del usuario mediante personalización futura |
| Notificaciones inteligentes | Permite alertas personalizadas, pero no es crítico en la primera versión |

---

##  Trade-offs Arquitectónicos

Durante la priorización se identificaron los siguientes compromisos:

- Mayor seguridad puede impactar el rendimiento del sistema
- Alta disponibilidad implica mayor complejidad en la infraestructura
- Mayor modularidad incrementa la complejidad del diseño

---

## 🔗 Trazabilidad

| Driver | Atributo | Prioridad |
|--------|---------|----------|
| Gestión de usuarios | Seguridad | Must |
| Gestión de pagos | Integridad | Must |
| Gestión de reservas | Disponibilidad | Must |
| Consultas de información | Rendimiento | Must |

---

##  Consecuencias

###  Positivas
- Permite enfocar la arquitectura en atributos críticos
- Mejora la toma de decisiones técnicas
- Facilita la comunicación entre el equipo

###  Negativas
- Incremento en la complejidad del sistema
- Necesidad de mayor control en la implementación

---

##  Conclusión

La aplicación de la matriz MoSCoW permitió priorizar los atributos de calidad de forma estructurada, asegurando que las decisiones arquitectónicas se basen en necesidades reales del sistema.

Estos atributos serán utilizados como base para la selección del patrón arquitectónico en el ADR-003.
