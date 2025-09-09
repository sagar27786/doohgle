# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app

# Copy dependency files and install
COPY package*.json tsconfig.json ./
RUN npm install
COPY . .

# Build frontend (outputs to dist/)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy built files into nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose nginx port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
