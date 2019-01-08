FROM node:11.6.0-alpine
LABEL maintainer="felix.yadomi@gmail.com"
LABEL openzwave.version="1.5.0"

ENV PATH /root/.yarn/bin:$PATH

RUN apk update \
  && apk --no-cache add --virtual build-dependencies curl binutils tar python make g++ linux-headers eudev-dev \
  && rm -rf /var/cache/apk/* 

RUN echo $'#! /bin/sh\necho $1\n' > /usr/bin/fmt && chmod +x /usr/bin/fmt

ADD https://github.com/OpenZWave/open-zwave/archive/V1.5.tar.gz archive.tar.gz
RUN tar -xzvf archive.tar.gz \
    && cd open-zwave-1.5 \
    && make && make install && ldconfig .

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./

RUN yarn install
COPY src src

RUN apk del build-dependencies
CMD yarn start