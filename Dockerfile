# Use Node.js 20 Alpine for lightweight, secure base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first for better layer caching
# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Create .next directory if it doesn't exist
RUN mkdir -p .next

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Start the development server
CMD ["npm", "run", "dev"]