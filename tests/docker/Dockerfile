FROM node:14-alpine

# Simulate a production environment
ENV NODE_ENV=production

# Setup a new folder to hold the test application
WORKDIR /app

# Install Next.js before copying files, to allow the layer to be cached by Docker
RUN mkdir /app/next9/ && cd $_ && npm init -y && npm install next@9 pino
RUN mkdir /app/next10/ && cd $_ && npm init -y && npm install next@10 pino
RUN mkdir /app/next11/ && cd $_ && npm init -y && npm install next@11 pino
RUN mkdir /app/next12/ && cd $_ && npm init -y && npm install next@12 pino
