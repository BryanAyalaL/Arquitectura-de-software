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

**Patrón Arquitectónico seleccionado:** Arquitectura en 3 Capas (Monolito Lógico) basado en **Node.js / Express**.

### Justificación técnica:
La decisión se fundamenta en la necesidad de entregar un producto funcional bajo un cronograma estricto, utilizando un stack basado en JavaScript/Node.js por su agilidad de desarrollo y gran soporte de la comunidad. 

Esta arquitectura nos permite:
1.  **Garantizar Integridad (RNF-06):** Uso de **MySQL** como base de datos relacional para gestionar transacciones ACID de forma nativa en módulos críticos como el de pagos.
2.  **Optimización de Rendimiento (RNF-01):** Para cumplir con el tiempo de respuesta < 2s y mitigar directamente el riesgo detectado en el **Issue #25** de GitHub sobre la latencia en la validación de seguridad, se incorpora **Redis** como capa de caché para la gestión de sesiones y tokens JWT.
3.  **Seguridad Centralizada (RNF-02/03):** Implementación de un flujo de autenticación robusto mediante el middleware **Passport.js** dentro del mismo proceso de la API, evitando la complejidad de gestionar seguridad en servicios distribuidos.

## 4. Consecuencias

* **Ventaja Principal:** Desarrollo acelerado y simplicidad de despliegue al mantener un único artefacto para toda la lógica de negocio.
* **Riesgo Aceptado (Complejidad de Datos):** Se acepta la gestión de dos motores de persistencia (MySQL + Redis). Aunque incrementa levemente la carga operacional, es una medida necesaria para garantizar el atributo de calidad de rendimiento y resolver cuellos de botella técnicos.
* **Consistencia Documental:** Esta actualización alinea formalmente el registro de decisiones con los diagramas de Contenedores (Nivel 2) y Componentes (Nivel 3), eliminando las discrepancias de stack tecnológico que existían anteriormente.

## 5. Alternativa Descartada

**Microservicios:**
Se descarta debido a la alta complejidad operacional y la falta de experiencia previa del equipo en orquestación avanzada. La introducción de una capa de caché (Redis) dentro del monolito se considera una solución mucho más eficiente y menos riesgosa que fragmentar el sistema en múltiples microservicios independientes.

---
**Decisión actualizada por el equipo de arquitectura para asegurar la paridad entre el diseño y la implementación real.**