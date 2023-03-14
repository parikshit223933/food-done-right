FROM node:16

WORKDIR /food-done-right

COPY . .
RUN npm install
