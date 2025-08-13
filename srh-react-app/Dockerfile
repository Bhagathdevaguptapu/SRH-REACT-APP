# Stage 1 - Build
FROM node:20-alpine

WORKDIR /app

# Copy only package files first (for caching)
COPY package*.json ./

# Install dependencies ignoring peer dependency issues
RUN npm install --legacy-peer-deps

# Copy rest of the app
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Run Vite dev server with host binding for Docker
CMD ["npm", "run", "dev", "--", "--host"]
