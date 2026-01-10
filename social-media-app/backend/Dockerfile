# Base image Node
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json + package-lock.json (tối ưu build)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy toàn bộ source
COPY . .

# Expose API port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
