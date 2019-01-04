FROM node:8

RUN mkdir /app
RUN mkdir /app/public

COPY . /app
WORKDIR /app

RUN npm install

EXPOSE 9000

ENTRYPOINT [ "node", "index.js" ]
