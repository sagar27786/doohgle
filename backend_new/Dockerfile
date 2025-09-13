# Use Node 20 slim image for security and consistency
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy dependency files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies to keep image small
RUN npm prune --production

# Expose backend port
EXPOSE 4001

# Start backend
CMD ["npm", "start"]
