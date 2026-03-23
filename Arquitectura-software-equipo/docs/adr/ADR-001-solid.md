# ADR-001: Identificación de Atributos de Calidad (ISO 25010)

##  Contexto

El sistema a desarrollar es una aplicación de planificación de viajes que permite gestionar reservas, transporte, alojamiento, actividades y pagos en una sola plataforma.

Actualmente, el proceso presenta los siguientes problemas:

- Manejo manual de reservas que genera errores y duplicaciones
- Falta de información en tiempo real sobre disponibilidad
- Baja personalización en la experiencia del usuario

Estos problemas hacen necesario definir atributos de calidad que guíen la arquitectura del sistema.

---

##  Atributos de Calidad Identificados

###  Seguridad

**Escenario:**
Un usuario intenta acceder al sistema → el sistema valida sus credenciales → permite acceso solo si son correctas en menos de 2 segundos.

**Escenario adicional:**
Después de 3 intentos fallidos de inicio de sesión → el sistema bloquea el acceso temporalmente durante 5 minutos.

---

###  Rendimiento

**Escenario:**
1000 usuarios consultan información simultáneamente → el sistema responde en menos de 2 segundos por cada petición.

---

### 📈 Disponibilidad

**Escenario:**
El sistema se encuentra en operación → debe estar disponible al menos el 99% del tiempo.

---

###  Mantenibilidad

**Escenario:**
Un desarrollador modifica el módulo de reservas → el cambio se realiza sin afectar otros módulos y en un tiempo menor a 2 horas.

---

###  Usabilidad

**Escenario:**
Un usuario nuevo accede al sistema → logra realizar una reserva completa en menos de 5 minutos sin asistencia.

---

##  Drivers Arquitectónicos

A partir del análisis del sistema, se identifican los siguientes drivers:

- Seguridad en autenticación y control de acceso (roles: administrador, gerente, usuario)
- Gestión de reservas y pagos
- Disponibilidad de información en tiempo real
- Personalización del servicio
- Integración de múltiples servicios (transporte, alojamiento, actividades)

---

##  Conclusión

Los atributos de calidad identificados establecen las bases para el diseño arquitectónico del sistema, permitiendo tomar decisiones fundamentadas en requisitos medibles.

Estos atributos serán priorizados en el ADR-002 para definir cuáles impactan directamente la arquitectura del sistema.
