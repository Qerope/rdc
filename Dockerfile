FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y \
    curl \
    git \
    nodejs \
    npm \
    sudo \
    && apt-get clean

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app

RUN git clone https://github.com/qerope/rdc

WORKDIR /app/rdc

RUN npm install -g npm@latest 

RUN npm install --force
RUN npm run build

EXPOSE 3000

CMD nohup npm run start --prefix /app/rdc & \
    tail -f /dev/null
