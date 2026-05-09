# Use Node.js LTS version
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app source
COPY . .

# Expose port
EXPOSE 5000

# Set environment variables (can be overridden)
ENV NODE_ENV=production
ENV PORT=5000

# Run the application
CMD ["node", "server.js"]
