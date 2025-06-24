FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Start the application
CMD ["node", "server.js"]