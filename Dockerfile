FROM debian:latest

# Installing Java (and curl)
RUN apt-get update && apt-get install -y curl default-jre default-jdk
RUN apt-get install -y build-essential
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash
RUN nvm install .
RUN nvm use .

RUN npm install -g yarn firebase-tools

RUN firebase setup:emulators:firestore

COPY . /

CMD yarn