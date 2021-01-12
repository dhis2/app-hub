# App Hub for DHIS 2

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# Environments

| Branch                                                   | Environment | URL                             | Build status                                                                                                |
| -------------------------------------------------------- | ----------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [`next`](https://github.com/dhis2/app-hub/tree/next)     | staging     | https://staging.apps.dhis2.org/ | ![app-hub staging](https://github.com/dhis2/app-hub/workflows/dhis2-docker%20ci/badge.svg?branch=next)      |
| [`master`](https://github.com/dhis2/app-hub/tree/master) | production  | https://apps.dhis2.org/         | ![app-hub production](https://github.com/dhis2/app-hub/workflows/dhis2-docker%20ci/badge.svg?branch=master) |

# Getting started

## Docker Compose

See docs in [dhis2/docker-compose/app-hub](https://github.com/dhis2/docker-compose/blob/master/app-hub/README.md).

## Local Installation

1. Install dependencies with `yarn install`
2. Copy `server/.env.template` to `server/.env` (`cp server/.env.template
   server/.env`) and edit `server/.env`. For development, your config will
   probably look something like:
   ```
   NODE_ENV=development
   RDS_USERNAME=postgres
   RDS_PASSWORD=postgres
   NO_AUTH_MAPPED_USER_ID=true
   ```
3. Create database tables with `yarn db:migrate`.
4. Seed the database with `yarn db:seed`

### Run

`yarn start`

### Reset database

`yarn db:reset`

## Backend config file

The backend config file `server/.env` contains credentials for the database, AWS S3 bucket and Auth0.

Available options are documented in [`.env.template`](server/.env.template).

See `server/knexfile.js` to specify which database connections/credentials or server to use depending on the value of `process.env.NODE_ENV`.

## Frontend config

The frontend needs to know some basic information about the server to configure routes and API endpoints.
This is located in [`client/default.config.js`](client/default.config.js).

You can rename or copy this file to override the settings.

Config files are loaded in the following order:

1. `default.config.js`
2. `config.js`

Environment specific configurations are also supported, and are loaded if `process.env.NODE_ENV` is set to either `development` or `production`.

- `development.config.js`
- `production.config.js`

Note that the exported objects from each config file are merged with the previous, so any options not changed are kept from the previous config.

_Note: If you make any changes, you will need to rebuild or restart webpack-dev-server for the changes to take effect._

### Example Development Config

```javascript
// development.config.js

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

`yarn start` will start both the frontend and backend.

Frontend available at `localhost:8080`.
Web API available at `localhost:3000/api/v1`.

Swagger UI available at `localhost:3000/documentation`
Swagger specs available at `localhost:3000/swagger.json`

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

- The `next` branch is deployed to **staging**.
- The `master` branch is deployed to **production**.

So: **all work should be merged to `next`, and then `next` is merged to
`master` when we decide to cut a release**.

## Report an issue

The issue tracker can be found in [DHIS2 JIRA](https://jira.dhis2.org)
under the [HUB](https://jira.dhis2.org/projects/HUB) project.

Deep links:

- Client:
  - [Bug](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10100&issuetype=10006&components=10314)
  - [Feature](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10100&issuetype=10300&components=10314)
  - [Task](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10100&issuetype=10003&components=10314)

- Server:
  - [Bug](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10100&issuetype=10006&components=10315)
  - [Feature](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10100&issuetype=10300&components=10315)
  - [Task](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10100&issuetype=10003&components=10315)
