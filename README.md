# App Store for DHIS 2

DHIS 2 app store

# Setup

### Clone the repo
```bash
git clone https://github.com/dhis2/dhis2-appstore.git
```

### Create back-end config file
Create config file called `appstore.conf` in `/opt/hisp/appstore` with the following config

> Note to change the credentials and secrets etc.

```
# JDBC driver connection URL
connection.url=jdbc:postgresql:appstore_db

# Database username
connection.username=<database username>

# Database password
connection.password=<database password>

#AmazonS3 access id
access.id=<AmazonS3 id>

#AmazonS3 secret key
secret.key=<AmazonS3 secret>

auth0.domain=<auth0 domain>
auth0.issuer=<auth0 certificate issuer>
auth0.clientId=<auth0 client id>
auth0.clientSecret=<auth0 client secret>
auth0.securedRoute=/secured/*
auth0.base64EncodedSecret=false 
auth0.authorityStrategy=ROLES
auth0.defaultAuth0ApiSecurityEnabled=false
auth0.signingAlgorithm=HS256
```

### Frontend config
The frontend needs to know some basic information about the server to configure routes and API endpoints.
This is located in `app/default.config.js`.

You can rename or copy this file to override the settings.
Tries to load config files in the following order:

    1. default.config.js
    2. config.js

Environment specific configs are also supported, and are merged if environment is set to either `development` or `production`.

    1. development.config.js
    2. production.config.js

Note that the exported objects from each config file are (shallowly) merged with the previous, so any options not changed are kept from the previous config. This also means that if you include any nested settings, like `api`, you will need to include the nested settings in this object if you want to keep them.

##### Base app name
This is the basename of where the app is located, used by routes. If it's hosted at `http://localhost:8080/appstore` this should be `/appstore`.
```
routes.baseAppName: '/appstore'
```
##### API BaseURL
The endpoint of the backend API to be used. 
```
api.baseURL: 'http://localhost:8080/appstore/api/',
```

##### API Redirect URL
The URL to be used when auth0 has successfully logged in a user, and is redirected back to the page. Note that this URL needs to be whitelisted on the auth0 side aswell.
```
 api.redirectURL: 'http://localhost:8080/appstore/user/'
```

### Create postgres database (if you do not have one yet)
```sql
CREATE DATABASE appstore_db OWNER dhis;
```

### Run the project

### Start the backend and frontend
```bash
mvn clean install
```
This will create a .war which can be deployed using tomcat.
The API and frontend will be hosted on the same instance. 

Web API available at `localhost:8080/appstore/api`.

Frontend at `localhost:8080/appstore/`.

#### Start the Web API backend independently

```bash
mvn clean install && mvn spring-boot:run -Dskip.webpack
```
Will be available at `localhost:3098/api/apps`.

### Start the front-end UI app independently (dev)

```bash
yarn install
yarn start
```
Will be available at `localhost:9000`. Using webpack-dev-server. 

Note that to use all the features of the app, you will need to run a back-end server. This can be done in frontend-development by running the back-end server as shown in the previous section, and changing the appropiate config settings (most likely just api.baseURL and api.redirectURL).

