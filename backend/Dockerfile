FROM node:18

WORKDIR /app

# Install dependencies (no special dependencies needed for bcryptjs)
RUN apt-get update && apt-get clean

COPY package*.json tsconfig.json ./
RUN npm install --production=false

# No need to rebuild bcryptjs as it's a pure JavaScript implementation

# Copy source code
COPY . .

# Build TypeScript -> outputs to dist/
RUN npm run build

# Remove dev dependencies (optional, smaller image)
RUN npm prune --production

# Expose backend port (make sure it matches app.listen(PORT))
EXPOSE 4001

# Start the server
CMD ["npm", "start"]
