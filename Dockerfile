FROM node:24.2.0-alpine

WORKDIR /usr/src/Smart-Brain-Backend

COPY ./ ./

RUN npm install

CMD [ "/bin/sh" ]
