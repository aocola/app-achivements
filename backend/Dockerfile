# Establecer la imagen base
FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de la aplicación al contenedor
COPY . .

# Compilar la aplicación NestJS
RUN npm run build

# Exponer el puerto en el que la aplicación escuchará
EXPOSE 3010

# Comando por defecto para iniciar la aplicación
CMD ["npm", "run", "start:prod"]