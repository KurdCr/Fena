# Dockerfile for Email Microservice
FROM node:16-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
 
RUN npm install
RUN npm run build

COPY . .


CMD ["npm", "run", "start:dev"]
