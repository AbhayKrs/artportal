# web/Dockerfile
FROM node:20 AS build
WORKDIR /app
COPY package*.json /scripts ./
RUN npm install
COPY . .
RUN npm run build

# Nginx stage
FROM nginx:1.27-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]