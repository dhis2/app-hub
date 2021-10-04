FROM node:14-bullseye as build

ENV NODE_ENV=development

WORKDIR /src

COPY . .

RUN yarn install --frozen-lockfile
RUN yarn workspace client build
RUN yarn workspace client pack --filename app-hub-client.tgz

RUN tar zxvf client/app-hub-client.tgz --directory server/
RUN mv server/package/build server/static && rm -rf server/package

# runtime image
FROM node:14-bullseye-slim

ENV NODE_ENV=production
ENV HOST=0.0.0.0

# copy the entire project folder
WORKDIR /srv
COPY --from=build /src ./apphub

# run the app
WORKDIR apphub
EXPOSE 3000
CMD ["node", "server/src/main.js"]
