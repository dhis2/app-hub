FROM node:lts-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

#use prebuilt frontend by default
ENV USE_PREBUILT_APP=1

#listen to all interfaces
ENV HOST=0.0.0.0

CMD ["node", "src/main.js"]
