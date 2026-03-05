# ---- Stage 1: Build the React app ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the source and build for production
COPY . .
RUN npm run build

# ---- Stage 2: Serve with a lightweight static server ----
FROM node:20-alpine

WORKDIR /app

# Install 'serve' — a simple static file server
RUN npm install -g serve

# Copy the built output from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Serve the dist folder on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
