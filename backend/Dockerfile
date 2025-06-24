# backend/Dockerfile

FROM --platform=linux/amd64 node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 8000
CMD ["node", "server.js"]