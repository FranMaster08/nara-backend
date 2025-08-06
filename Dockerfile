# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm install --production --legacy-peer-deps
# Instalar tsconfig-paths para registrar rutas de TypeScript
RUN npm install tsconfig-paths --legacy-peer-deps

ENV NODE_ENV=production

CMD ["sh", "-c", "npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource ormconfig.ts migration:run && node dist/main.js"]