FROM node:alpine
WORKDIR /code
COPY package*.json ./
RUN apk add  --no-cache ffmpeg
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && npm i \
    && apk del .gyp
COPY . .
CMD [ "node", "index.js" ]
