FROM node:14-buster as build

ENV NODE_ENV=development

WORKDIR /src

COPY . .

RUN yarn install --frozen-lockfile
RUN yarn workspace client build
RUN yarn workspace client pack --filename app-hub-client.tgz

RUN tar zxvf client/app-hub-client.tgz --directory server/
RUN mv server/package/build server/static && rm -rf server/package

FROM node:14-buster-slim

ENV NODE_ENV=production
ENV HOST=0.0.0.0

WORKDIR /srv

COPY --from=build /src/server ./app-hub

WORKDIR app-hub
RUN yarn install --frozen-lockfile

EXPOSE 3000
CMD ["node", "src/main.js"]
