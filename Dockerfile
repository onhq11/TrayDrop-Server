FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
ENV WEBSERVER_PORT=8080
ENV DATABASE_TYPE=mongodb
ENV DATABASE_URL=mongodb://192.168.1.90:55420/traydrop
CMD [ "node", "index.js" ]
