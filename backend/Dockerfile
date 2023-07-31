FROM node:18.15.0

ENV CONTAINER_PATH=/home/app
WORKDIR $CONTAINER_PATH

COPY . .

RUN yarn install

ENTRYPOINT node server.js