* **Estado:** Aceptado
* **Fecha:** 2024-03-24
* **Equipo:** Estudiante Grupo 3
* **Contexto:** Laboratorio 3 — Selección del Patrón Arquitectónico

## 1. Cuestionario de Diseño Arquitectónico (Evidencia)

Este cuestionario fue completado por el equipo para evaluar las capacidades técnicas, los requisitos de negocio y las restricciones del proyecto.

### SECCIÓN 1 — EXPERIENCIA DEL EQUIPO
* **Pregunta 1: ¿Experiencia previa con Microservicios?**
  * Opción: **C** (No tenemos experiencia con microservicios).
* **Pregunta 2: ¿Dominio de orquestación (Docker/Kubernetes)?**
  * Opción: **B** (Sabemos usar Docker básico pero no orquestación avanzada).
* **Pregunta 3: ¿Tiempo disponible para el proyecto?**
  * Opción: **C** (Tiempo limitado, necesitamos la solución más simple posible).

### SECCIÓN 2 — DOMINIOS DEL NEGOCIO
* **Pregunta 4: ¿Dominios de negocio separados?**
  * Identificados: Usuarios, Pagos, Actividades, Transportes.
  * Opción: **C** (Dominio principal con funcionalidades relacionadas).
* **Pregunta 5: ¿Bases de datos independientes por dominio?**
  * Opción: **C** (No, los datos están muy relacionados y separar BDs sería muy complejo).
* **Pregunta 6: ¿Ciclos de vida de despliegue diferentes?**
  * Opción: **C** (No, el sistema se despliega completo cada vez).

### SECCIÓN 3 — ESCALABILIDAD Y RENDIMIENTO
* **Pregunta 7: ¿Usuarios concurrentes?**
  * Opción: **C** (Menos de 1,000 usuarios concurrentes).
* **Pregunta 8: ¿Escala independiente de módulos?**
  * Opción: **B** (Hay diferencias de carga pero no son críticas. Módulo cargado: Usuarios).
* **Pregunta 9: ¿Disponibilidad diferenciada por módulo?**
  * Opción: **B** (Todos deben tener alta disponibilidad pero no diferenciada).
* **Pregunta 10: ¿Rendimiento fue Must Have en Lab 2?**
  * Opción: **A** (Sí, el rendimiento es crítico).

### SECCIÓN 4 — MANTENIBILIDAD Y ORGANIZACIÓN
* **Pregunta 11: ¿División del equipo en servicios independientes?**
  * Opción: **C** (No, el equipo trabaja mejor de forma colaborativa en un solo código base).
* **Pregunta 12: ¿Disposición para gestionar complejidad operacional?**
  * Opción: **C** (No, preferimos enfocarnos en la lógica de negocio sin overhead).
* **Pregunta 13: ¿Mantenibilidad fue Must Have en Lab 2?**
  * Opción: **C** (No es una prioridad alta comparada con otros atributos).

---

## 2. Sistema de Puntuación y Resultados

| Respuesta | Cantidad | Puntaje | Total |
| :--- | :--- | :--- | :--- |
| **A — Favorece Microservicios** | 1 | x 2 | 2 |
| **B — Neutral / Intermedio** | 3 | x 1 | 3 |
| **C — Favorece 3 Capas** | 9 | x 0 | 0 |
| **TOTAL** | | | **5** |



---

## 3. Decisión Final

**Patrón Arquitectónico seleccionado:** Arquitectura en 3 Capas (Monolito Lógico).

### Justificación técnica:
La decisión se fundamenta en la necesidad de entregar un producto funcional dentro de un cronograma académico estricto. El equipo carece de experiencia en la gestión de sistemas distribuidos, lo que convierte a los **Microservicios** en un riesgo alto de fallo. 

La **Arquitectura en 3 Capas** nos permite:
1.  **Garantizar Integridad (RNF-06):** Al usar una sola base de datos MySQL, gestionamos transacciones ACID de forma nativa para el módulo de pagos.
2.  **Rendimiento (RNF-01):** Cumplimos con el tiempo de respuesta < 2s al evitar latencias de red entre servicios.
3.  **Seguridad (RNF-02/03):** Centralizamos la autenticación JWT y el control RBAC en un único flujo.

## 4. Consecuencias

*   **Ventaja Principal:** Simplicidad de implementación y despliegue rápido. Menor sobrecarga (overhead) de configuración y monitoreo.
*   **Riesgo Aceptado:** Escalabilidad limitada. Si el tráfico supera las expectativas, el escalado será vertical o mediante réplicas de todo el monolito. Se acepta esta deuda técnica dado el contexto del proyecto.
*   **Mitigación de Riesgo:** Se implementará una estructura de carpetas por dominios (Modular Monolith) para facilitar una posible migración a microservicios en el futuro si fuera necesario.

## 5. Alternativa Descartada

**Microservicios:**
Se descarta debido a que la complejidad de implementar comunicación entre servicios (API Gateway, Service Discovery) y la gestión de múltiples bases de datos consumiría el tiempo destinado al desarrollo de la lógica de negocio. Además, la consistencia de datos en pagos requeriría patrones complejos (Saga/Outbox) que el equipo no domina.

---
**Decisión tomada por el equipo de arquitectura.**

