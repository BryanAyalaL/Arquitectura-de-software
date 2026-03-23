# ADR-002: Priorización de Atributos de Calidad (Matriz MoSCoW)

## 📌 Contexto

El presente proyecto consiste en el desarrollo de una aplicación de planificación de viajes que integra múltiples servicios como reservas, pagos, transporte, alojamiento y actividades.

A partir del análisis del problema, se identificaron las siguientes dificultades:
- Procesos manuales en la gestión de reservas
- Falta de información en tiempo real
- Ausencia de personalización para el usuario

Estos problemas generan la necesidad de definir atributos de calidad que guíen la arquitectura del sistema.

---

## 🎯 Decisión

Se aplicó la técnica MoSCoW para priorizar los atributos de calidad identificados en el ADR-001.

### 🟥 Must Have (Obligatorios)

| Atributo | Justificación |
|----------|--------------|
| Seguridad | El sistema maneja autenticación y datos sensibles de usuarios |
| Control de acceso (RBAC) | Existen roles: administrador, gerente y usuario |
| Integridad de datos | Se gestionan pagos y reservas críticas |
| Disponibilidad | El sistema debe estar accesible en todo momento |
| Rendimiento | Se requiere respuesta rápida en consultas |
| Modularidad | Facilita el desarrollo en equipo y mantenimiento |

---

### 🟨 Should Have (Importantes)

| Atributo | Justificación |
|----------|--------------|
| Logging | Permite monitorear errores del sistema |
| Observabilidad | Facilita el análisis del comportamiento del sistema |
| Usabilidad | Mejora la experiencia del usuario |

---

### 🟩 Could Have (Deseables)

| Atributo | Justificación |
|----------|--------------|
| Recomendaciones avanzadas | Mejora futura del sistema |
| Notificaciones inteligentes | No es crítico para la primera versión |

---

## ⚖️ Trade-offs Arquitectónicos

Durante la priorización se identificaron los siguientes compromisos:

- Mayor seguridad puede afectar el rendimiento
- Mayor modularidad incrementa la complejidad del sistema
- Alta disponibilidad implica mayor uso de infraestructura

---

## 🔗 Trazabilidad

| Driver | Atributo | Prioridad |
|--------|---------|----------|
| Gestión de usuarios | Seguridad | Must |
| Gestión de pagos | Integridad | Must |
| Gestión de reservas | Disponibilidad | Must |
| Consultas de datos | Rendimiento | Must |

---

## 📌 Consecuencias

### ✅ Positivas
- Claridad en la toma de decisiones arquitectónicas
- Base sólida para seleccionar el patrón arquitectónico
- Mejora la organización del desarrollo

### ❌ Negativas
- Incremento en la complejidad del sistema
- Necesidad de mayor control en implementación

---

## 🧠 Conclusión

La priorización de atributos de calidad permite enfocar el desarrollo en los aspectos críticos del sistema, asegurando que la arquitectura responda a las necesidades reales del proyecto.
