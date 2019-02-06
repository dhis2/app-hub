# App Store for DHIS 2

Visit the live [DHIS 2 app store](https://play.dhis2.org/appstore/)

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

## Create back-end config file
Coming soon


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
        baseURL: "http://localhost:3098/api/",
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
```bash
mvn clean install
```

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

