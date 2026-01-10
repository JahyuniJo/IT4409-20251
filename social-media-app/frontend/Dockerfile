
# Build stage
FROM node:18 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Serve stage
FROM nginx:latest
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
