# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
RUN npm install --force

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]