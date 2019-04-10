# App Store for DHIS 2

Visit the live [DHIS 2 app store](https://play.dhis2.org/appstore/)

Note: The master branch currently holds the version 2 of the unreleased App Store. For the current version in production see https://github.com/dhis2/app-store/tree/app-store-v1


# Setup

## Clone the repo
```bash
git clone https://github.com/dhis2/dhis2-appstore.git
```

## Create & seed test-database
Create a database `appstore` in postgres with user/login appstore/appstore123 (or change credentials in `packages/server/src/knexfile.js`)

If you want to use a local sqllite3 database instead of setting up a new postgres-database, use NODE_ENV=test (this will also be used for unit/integration tests)

### Migrate/create tables
```bash
cd packages/server
yarn install
npx knex migrate:latest
```

### Seed testdata
```bash
cd packages/server
npx knex seed:run
```

### Reset & recreate database
```bash
cd packages/server
npx knex migrate:rollback && npx knex migrate:latest && npx knex seed:run
```

## Create back-end config file (optional)

The back-end config file contain credentials for database, AWS S3 bucket and Auth0.

Env vars (~/.dhis2/appstore/vars)
```bash

#Set auth strategy used in backend, to use auth0 for example set this to 'jwt' and fill in the other auth0 vars
AUTH_STRATEGY

#Only need to set this if no auth is used (dev/test), to map requests against a database user by its id
#This needs to be set if AUTH_STRATEGY is not set
NO_AUTH_MAPPED_USER_ID

#Secrets for signing jwt token
AUTH0_SECRET
AUTH0_M2M_SECRET

#The m2m api must use the same audience as the web app, specify the audience to use here
AUTH0_AUDIENCE

#Auth0 domain, usually https://{tenant}.{region}.auth0.com
AUTH0_DOMAIN

#algorithm used for signing the jwt-tokens for example HS256
AUTH0_ALG

#For the S3 storage where application files will be stored.
AWS_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_BUCKET_NAME

#EBS will inject these so no need to set them manually in EBS Environments
RDS_HOSTNAME
RDS_USERNAME
RDS_PASSWORD
RDS_DB_NAME
```
See /packages/server/knexfile.js to change database connections/credentials or server which will be used depending on process.env.NODE_ENV

## Frontend config
The frontend needs to know some basic information about the server to configure routes and API endpoints.
This is located in `app/default.config.js`.

You can rename or copy this file to override the settings.
Tries to load config files in the following order:

1. default.config.js
2. config.js

Environment specific configurations are also supported, and are loaded if environment is set to either `development` or `production`.

* development.config.js
* production.config.js

Note that the exported objects from each config file are merged with the previous, so any options not changed are kept from the previous config.

*Note: If you make any changes, you will need to rebuild or restart webpack-dev-server for the changes to take effect.*

### Example Development Config
`development.config.js`
```javascript
module.exports = {
    api: {
        baseURL: "http://localhost:3000/v1/",
        redirectURL: "http://localhost:9000/user"
    },
    routes: {
        baseAppName: ""
    }
};
```


##### Base app name
This is the basename of where the app is located, used by routes. If it's hosted at `http://localhost:8080/appstore` this should be `/appstore`.
```javascript
routes.baseAppName: '/appstore'
```
##### API BaseURL
The endpoint of the backend API to be used. 
```javascript
api.baseURL: 'http://localhost:8080/appstore/api/',
```

##### API Redirect URL
The URL to be used when auth0 has successfully logged in a user, and is redirected back to the page. Note that this URL needs to be whitelisted on the auth0 side aswell.
```javascript
 api.redirectURL: 'http://localhost:8080/appstore/user/'
```

# Run the project

### Start the backend and frontend

Web API available at `localhost:3000/`.

Swagger UI available at `localhost:3000/documentation`
Swagger specs available at `localhost:3000/swagger.json`

Frontend at `localhost:9000/appstore/`.

#### Start the Web API backend independently

```bash
cd packages/server
yarn install
yarn start
```
Will be available at `localhost:9000/`.
This will skip the webpack-bundling, and the frontend will not be available.

### Start the front-end app independently (dev)

```bash
cd packages/client
yarn install
yarn start
```
Will be available at `localhost:9000`. Using webpack-dev-server. 

Note that to use all the features of the app, you will need to run a back-end server. This can be done in frontend-development by running the back-end server as shown in the previous section, and changing the appropriate config settings (most likely just api.baseURL, api.redirectURL and routes.baseAppName).

