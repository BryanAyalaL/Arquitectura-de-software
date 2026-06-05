# ADR-005: Materialización Física — Contenerización y Pipeline CI/CD

* **Estado:** Aceptado
* **Fecha:** 2024-03-24
* **Autores:** Equipo de Arquitectura (Estudiante 3)
* **Contexto:** Laboratorio 8 — Diseño de Infraestructura y Automatización

---

## 1. Contexto y Problema

Durante el desarrollo del sistema de planificación de viajes, nos enfrentamos al clásico problema de **"Funciona en mi máquina"**. Dado que los desarrolladores utilizan diferentes sistemas operativos (Ubuntu, Windows, Mac), existen discrepancias en las versiones de Node.js, dependencias nativas y configuraciones locales. 

Adicionalmente, el sistema requiere una API, una base de datos relacional (MySQL) y una caché (Redis). Levantar todo esto manualmente es propenso a errores. Necesitamos una estrategia que garantice que la aplicación se ejecute de forma idéntica en cualquier entorno y un mecanismo que automatice las pruebas y el despliegue a producción.

---

## 2. Decisión Arquitectónica

Se decide adoptar un enfoque de **Infraestructura como Código (IaC)** utilizando el siguiente stack tecnológico:

1. **Docker:** Para la contenerización estricta de la aplicación.
2. **Docker Compose:** Para la orquestación local de los servicios (API, BD, Caché).
3. **GitHub Actions:** Para la Integración Continua (CI) y Despliegue Continuo (CD).

---

## 3. Explicación Técnica y Comandos a Utilizar

Para estandarizar el flujo de trabajo del equipo, a continuación se detallan las herramientas implementadas y su uso:

### A. Dockerfile (Multi-stage y Seguridad)
El `Dockerfile` es la "receta" que empaqueta nuestra API.
* **Multi-stage (Múltiples etapas):** Usamos una etapa `builder` para instalar todas las herramientas (usando `npm ci` para instalar versiones exactas bloqueadas en el `package-lock.json`). Luego, una etapa `production` que copia solo lo compilado y omite dependencias de desarrollo. Esto reduce drásticamente el peso de la imagen.
* **Seguridad (Usuario no-root):** Por defecto, Docker ejecuta todo como `root` (administrador). Hemos configurado `USER node` para aplicar el *Principio de Menor Privilegio*. Si la API es vulnerada, el atacante no tendrá permisos para tomar control del contenedor.

**Comandos clave:**
* `docker build -t app-turismo:1.0.0 .` → Lee el Dockerfile, empaqueta el código y crea la "Imagen" localmente.
* `docker run -p 3000:3000 app-turismo:1.0.0` → Levanta un contenedor aislado a partir de la imagen y expone el puerto 3000.

### B. Docker Compose (Orquestación)
El archivo `docker-compose.yml` actúa como el director de orquesta. 
* **Redes internas:** Crea una red virtual (`turismo_network`). La API puede conectarse a la BD simplemente llamando al host `db` en lugar de direcciones IP complejas, ya que Docker actúa como DNS interno.
* **Volúmenes (`volumes`):** Se declaran para MySQL y Redis. Esto crea un "disco duro virtual" en la máquina anfitriona. Si el contenedor de la BD se destruye, los datos de los usuarios NO se pierden.
* **Variables de Entorno (`environment`):** Cumpliendo con la regla de oro de *The Twelve-Factor App*, las credenciales y puertos se inyectan desde este archivo, nunca quemados en el código fuente.

**Comandos clave:**
* `docker compose up -d` → Descarga imágenes, crea redes, volúmenes y levanta la API, BD y Caché en segundo plano.
* `docker ps` → Muestra la lista de contenedores que están ejecutándose.
* `docker compose down` → Apaga y elimina los contenedores (los datos en volúmenes se mantienen a salvo).

### C. GitHub Actions (Pipeline CI/CD)
Es un "robot" que vive en nuestro repositorio.
* **CI (Integración Continua):** Se activa al hacer `push`. Clona el código, instala Node.js e intenta construir la imagen de Docker. Funciona como un detector de errores automatizado.
* **CD (Despliegue Continuo):** Contiene un condicional (`if: github.ref == 'refs/heads/main'`). Solo si el código se fusiona con la rama principal de producción, ejecuta los scripts para actualizar el servidor remoto (Render/Railway), logrando despliegues sin intervención manual.

---

## 4. Consecuencias (Ventajas y Trade-offs)

### ✅ Ventajas
* **Inmutabilidad:** La imagen creada en el PC de un desarrollador es exactamente bit a bit la misma que correrá en producción.
* **Aislamiento Total:** El contenedor posee su propio sistema operativo (Alpine Linux), evitando conflictos con otros programas instalados en la máquina anfitriona.
* **Automatización Segura:** Evita despliegues manuales (vulnerables a errores de tipeo humanos) y detecta código roto antes de que afecte a los clientes reales.
* **Recuperación rápida:** Ante una caída del servidor, levantar toda la infraestructura nuevamente toma menos de 10 segundos con `docker compose up`.

### ⚠️ Desventajas / Trade-offs
* **Consumo de recursos locales:** Ejecutar MySQL, Redis y la API simultáneamente mediante Docker consume más memoria RAM en los equipos de los desarrolladores.
* **Curva de aprendizaje:** Exige que todo el equipo conozca los comandos básicos de Docker descritos en la sección 3.

---

## 5. Alternativas Descartadas

1. **Máquinas Virtuales (VirtualBox / VMware):**
   * *Motivo de rechazo:* Consumen demasiados recursos. Una VM requiere virtualizar un hardware completo y un sistema operativo pesado (GBs de RAM). Docker solo aísla procesos compartiendo el Kernel del anfitrión (MBs de RAM).
2. **Jenkins para CI/CD:**
   * *Motivo de rechazo:* Jenkins requiere que el equipo alquile y mantenga un servidor dedicado solo para correr los pipelines. GitHub Actions es "Serverless" (sin servidor), gratuito, y está nativamente integrado donde ya reside nuestro código fuente.
3. **Despliegues Manuales (FTP / SSH):**
   * *Motivo de rechazo:* Entrar por terminal al servidor para hacer `git pull` y `npm install` genera "tiempos de inactividad" (downtime) y el conocimiento de despliegue recae en una sola persona (riesgo de "Bus factor").
4. **Almacenamiento de credenciales en el código:**
   * *Motivo de rechazo:* Pésima práctica de ciberseguridad. Subir contraseñas a GitHub permite robo inmediato de datos. Por eso adoptamos inyección por Docker Compose / Variables de entorno.