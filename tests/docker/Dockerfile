FROM node:14-alpine

# Simulate a production environment
ENV NODE_ENV=production

# Setup a new folder to hold the test application
WORKDIR /app

# Install Next.js before copying files, to allow the layer to be cached by Docker
RUN npm init -y
RUN npm install next pino

# Copy the library files from the working directory
COPY . node_modules/next-logger
RUN cd node_modules/next-logger && npm install --production
