FROM node:18-alpine

MAINTAINER Welson

WORKDIR /usr/src/app/server


ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY install.sh ./
COPY package*.json ./
RUN sh install.sh

COPY . .

CMD ["npm", "start"]