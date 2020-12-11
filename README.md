# App Hub for DHIS 2

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# Environments

| Branch                                                   | Environment | URL                             | Build status                                                                                                |
| -------------------------------------------------------- | ----------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [`next`](https://github.com/dhis2/app-hub/tree/next)     | staging     | https://staging.apps.dhis2.org/ | ![app-hub staging](https://github.com/dhis2/app-hub/workflows/dhis2-docker%20ci/badge.svg?branch=next)      |
| [`master`](https://github.com/dhis2/app-hub/tree/master) | production  | https://apps.dhis2.org/         | ![app-hub production](https://github.com/dhis2/app-hub/workflows/dhis2-docker%20ci/badge.svg?branch=master) |

# Setup

## Clone the repo

```bash
git clone https://github.com/dhis2/app-hub.git
```

## With Docker Compose

-   See docs in [dhis2/docker-compose/app-hub](https://github.com/dhis2/docker-compose/blob/master/app-hub/README.md).

## With Postgres

### Create & seed test-database

Create a database `apphub` in postgres

#### Migrate/create tables

```bash
npx knex migrate:latest
```

#### Seed testdata

```bash
npx knex seed:run
```

#### Reset & recreate database

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

-   development.config.js
-   production.config.js

Note that the exported objects from each config file are merged with the previous, so any options not changed are kept from the previous config.

_Note: If you make any changes, you will need to rebuild or restart webpack-dev-server for the changes to take effect._

### Example Development Config

`development.config.js`

```javascript
module.exports = {
    api: {
        baseURL: 'http://localhost:3000/api/',
        redirectURL: 'http://localhost:3000/user',
    },
    routes: {
        baseAppName: '',
    },
}
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

# Clone the existing production App Hub (approved/published apps) to your own local App Hub

```bash
 yarn start
```

and then in another terminal:

```bash
 yarn run clone
```

# Release

This application is automatically released when merging into controlled
branches.

-   The `next` branch is deployed to **staging**.
-   The `master` branch is deployed to **production**.

So: **all work should be merged to `next`, and then `next` is merged to
`master` when we decide to cut a release**.

## Report an issue

The issue tracker can be found in [DHIS2 JIRA](https://jira.dhis2.org)
under the [HUB](https://jira.dhis2.org/projects/HUB) project.

Deep links:

-   Client:

    -   [Bug](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10100&issuetype=10006&components=10314)
    -   [Feature](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10100&issuetype=10300&components=10314)
    -   [Task](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10100&issuetype=10003&components=10314)

-   Server:
    -   [Bug](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10100&issuetype=10006&components=10315)
    -   [Feature](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10100&issuetype=10300&components=10315)
    -   [Task](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10100&issuetype=10003&components=10315)
