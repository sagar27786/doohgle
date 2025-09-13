# Stage 1: Build
FROM node:20-slim AS build
WORKDIR /app

# Increase Node heap memory for large builds
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy dependency files and install
COPY package*.json tsconfig.json ./
RUN npm install

# Copy all source code
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
