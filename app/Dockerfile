FROM node:0.10.31

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install -g bower && npm install && bower install --allow-root

EXPOSE 7070

CMD [ "node", "index.js" ]
