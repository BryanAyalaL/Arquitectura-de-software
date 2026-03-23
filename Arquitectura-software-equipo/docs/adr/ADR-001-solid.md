# ADR-001: Identificación de Atributos de Calidad (ISO 25010)

## 📌 Contexto

El sistema a desarrollar es una aplicación de planificación de viajes que permite gestionar reservas, transporte, alojamiento, actividades y pagos en una sola plataforma.

Actualmente, el proceso presenta problemas como:
- Manejo manual de reservas
- Falta de información en tiempo real
- Baja personalización del servicio

Esto requiere definir atributos de calidad que guíen la arquitectura del sistema.

---

## 🎯 Atributos de Calidad Identificados

### 🔐 Seguridad

**Escenario:**
Un usuario intenta acceder al sistema → el sistema valida sus credenciales → solo permite acceso si son correctas en menos de 2 segundos.

---

### ⚡ Rendimiento

**Escenario:**
1000 usuarios consultan información simultáneamente → el sistema responde en menos de 2 segundos por petición.

---

### 📈 Disponibilidad

**Escenario:**
El sistema está en operación → debe estar disponible el 99% del tiempo durante el día.

---

### 🧩 Mantenibilidad

**Escenario:**
Un desarrollador necesita modificar el módulo de reservas → el cambio se realiza sin afectar otros módulos del sistema.

---

### 👤 Usabilidad

**Escenario:**
Un usuario nuevo accede al sistema → puede realizar una reserva sin ayuda en menos de 5 minutos.

---

## 🧠 Drivers Arquitectónicos

A partir del análisis del sistema, se identifican los siguientes drivers:

- Seguridad en autenticación y control de acceso
- Gestión de reservas y pagos
- Disponibilidad de información en tiempo real
- Personalización del servicio

---

## 📌 Conclusión

Los atributos de calidad identificados definen las bases para la toma de decisiones arquitectónicas, permitiendo diseñar un sistema que responda a las necesidades reales del usuario.
