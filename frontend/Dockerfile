# Build stage
FROM node:20 AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including dev for build)
RUN npm install

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL
ARG VITE_PORT=4173

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_PORT=$VITE_PORT

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 4173

# Start the application with explicit port
CMD ["serve", "-s", "dist", "-l", "4173"]