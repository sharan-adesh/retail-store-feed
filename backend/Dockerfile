# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

# Copy compiled JavaScript and app.ts from builder
COPY --from=builder /app/dist ./dist

EXPOSE 8080

ENV NODE_NO_WARNINGS=ExperimentalWarning

CMD ["npm", "run", "start:prod"]
