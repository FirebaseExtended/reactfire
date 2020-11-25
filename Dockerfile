FROM debian:latest

SHELL ["/bin/bash", "-l", "-c"]

ENV CI true

# Installing Java (and curl)
RUN DEBIAN_FRONTEND=noninteractive apt-get update -qq < /dev/null > /dev/null
RUN DEBIAN_FRONTEND=noninteractive apt-get install -qq curl default-jre < /dev/null > /dev/null

RUN curl --silent -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash
COPY .nvmrc /
RUN nvm install
RUN npm install --unsafe-perm -g yarn firebase-tools
RUN firebase setup:emulators:firestore

ENV PYTHON /usr/bin/python2.7

COPY package.json /
COPY yarn.lock /
RUN yarn install --frozen-lockfile

COPY . /

RUN yarn test

ARG SHORT_SHA=""
ARG NPM_TOKEN=""
ARG TAG_NAME=""

RUN ./publish.sh
