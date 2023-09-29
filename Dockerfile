FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
COPY config/config.json /usr/src/app/config/
EXPOSE 8080
CMD [ "node", "index.js" ]
