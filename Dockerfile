FROM node:lts-slim as build

ENV NODE_ENV=development

WORKDIR /src

COPY . .

RUN npm install
RUN npm run build
RUN npm pack

RUN tar zxvf dhis2-app-hub-*.tgz

FROM node:lts-slim

ENV NODE_ENV=production
ENV USE_PREBUILT_APP=1
ENV HOST=0.0.0.0

WORKDIR /srv

COPY --from=build /src/package ./app-hub

WORKDIR app-hub
RUN npm install

EXPOSE 3000
CMD ["node", "src/main.js"]
