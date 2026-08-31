# --- Etapa 1: instalar dependencias y preparar la aplicación ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src

# --- Etapa 2: imagen final, mínima ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY package.json .

EXPOSE 3000
CMD ["node", "src/server.js"]
