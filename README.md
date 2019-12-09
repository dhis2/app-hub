# App Hub for DHIS 2

Visit the live [DHIS 2 app hub](https://play.dhis2.org/apphub/)

Note: The master branch currently holds the version 2 of the unreleased App Hub. For the current version in production see https://github.com/dhis2/app-store/tree/app-store-v1


# TO DO

- [ ] Fix tests after merge
- [ ] Split up the deployment work so that Travis builds the frontend,
  and runs the test against the backend, if both pass, deploy the
  _built_ frontend with the backend to EBS. Remove on-server build
  delay. Allow webapp to be a CRA app.


# Setup

## Clone the repo
```bash
git clone https://github.com/dhis2/dhis2-apphub.git
```

## Create & seed test-database
Create a database `apphub` in postgres

### Migrate/create tables
```bash
npx knex migrate:latest
```

### Seed testdata
```bash
npx knex seed:run
```

### Reset & recreate database
```bash
cd packages/server
npx knex migrate:rollback && npx knex migrate:latest && npx knex seed:run
```

## Create back-end config file (optional)

The back-end config file contain credentials for database, AWS S3 bucket and Auth0.

Env vars (.env), see .env.template
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

#For the S3 storage where application files will be stored, if using S3.
AWS_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_BUCKET_NAME

#EBS will inject these so no need to set them manually in EBS Environments, in local/other environments set these to the database to use for the app-store backend.
RDS_HOSTNAME
RDS_USERNAME
RDS_PASSWORD
RDS_DB_NAME
```
See knexfile.js to change database connections/credentials or server which will be used depending on process.env.NODE_ENV

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
        baseURL: "http://localhost:3000/api/",
        redirectURL: "http://localhost:3000/user"
    },
    routes: {
        baseAppName: ""
    }
};
```


##### Base app name
This is the basename of where the app is located, used by routes. If it's hosted at `http://localhost:3000/someUrl` this should be `someUrl` otherwise leave empty.
```javascript
routes.baseAppName: ''
```
##### API BaseURL
The endpoint of the backend API to be used. 
```javascript
api.baseURL: 'http://localhost:3000/api/',
```

##### API Redirect URL
The URL to be used when auth0 has successfully logged in a user, and is redirected back to the page. Note that this URL needs to be whitelisted on the auth0 side aswell.
```javascript
 api.redirectURL: 'http://localhost:3000/user/'
```

# Run the project

### Start the backend and frontend

Web API available at `localhost:3000/api/v1`.

Swagger UI available at `localhost:3000/documentation`
Swagger specs available at `localhost:3000/swagger.json`

Frontend at `localhost:3000/`.
