FROM debian:latest

# Installing Java (and curl)
RUN apt-get update && apt-get install -y \
  curl \
  default-jre \
  default-jdk

# Installing Node / NPM
# https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - \
  && apt-get install -y nodejs \
  && curl -L https://www.npmjs.com/install.sh | sh \
  && apt-get install -y build-essential

RUN npm install -g yarn firebase-tools

RUN firebase setup:emulators:firestore

COPY . /

CMD ./test.sh