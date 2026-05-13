# Etapa 1: Construcción (Builder)
# Usamos una imagen base ligera de Node.js (Alpine Linux)
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias al contenedor
COPY package.json package-lock.json ./

# Instalamos las dependencias del proyecto
RUN npm ci

# Copiamos el resto del código fuente al contenedor
COPY . .

# Etapa 2: Producción (Release)
# Iniciamos una nueva imagen desde cero (más ligera)
FROM node:20-alpine AS production

# Declaramos variables de entorno criticas para produción
ENV NODE_ENV=production

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/package.json /app/package-lock.json ./

# Instalamos solo las dependencias de producción
# CI es para asegurar que se instalen exactamente las versiones del lockfile, y omitimos las devDependencies
RUN npm ci --omit=dev

# Copiamos el código fuente necesario para producción
COPY --from=builder /app/src ./src

# Seguridad: Cambiamos la propierdad de la carperta usuario a no-root
RUN chown -R node:node /app

# Cambiamos al usuario no-root para ejecutar la aplicación
USER node

# Exponemos el puerto en el que la aplicación se ejecutará
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "src/server.js"]