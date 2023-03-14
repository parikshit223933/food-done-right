FROM node:16

WORKDIR /food-done-right


COPY package*.json ./
RUN npm ci --only=production
COPY . .
