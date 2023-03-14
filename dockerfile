FROM node:16-alpine

RUN apk update

RUN mkdir /food-done-right
WORKDIR /food-done-right

COPY . .
RUN npm install
