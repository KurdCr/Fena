# Dockerfile for api-gateway
FROM node:16-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
 
RUN npm install
RUN npm run build

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
