# Etapa 1: Construcción (Builder)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./

# Etapa 2: Producción (Release)
FROM node:20-alpine AS production

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/src ./src

RUN chown -R node:node /app
USER node

EXPOSE 3000
CMD ["node", "src/server.js"]
