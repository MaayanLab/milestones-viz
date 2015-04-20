FROM library/node:0.10

RUN apt-get update && apt-get install -y npm

RUN npm install -g bower

WORKDIR /home

COPY . /home

RUN npm install

RUN bower install --allow-root

EXPOSE 7070

RUN echo "10.91.53.62" >> /etc/hosts

CMD /bin/bash -c "node index.js"