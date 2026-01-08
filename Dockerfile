# Etapa 1: Construcción
FROM node:18-alpine AS build

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir SIN verificación de tipos
RUN npm run build -- --mode production || npm run build:nocheck || npx vite build

# Etapa 2: Nginx
FROM nginx:1.21.0-alpine

# Copiar archivos compilados
COPY --from=build /app/dist /usr/share/nginx/app-frontend-administrative-processes

# Copiar configuraciones nginx
COPY default.conf /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/nginx.conf

RUN echo 'alias ll="ls -lha"' >> ~/.bashrc

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]