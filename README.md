# App Store for DHIS 2

DHIS 2 app store

# Setup

### Clone the repo
```bash
git clone https://github.com/dhis2/dhis2-appstore.git
```

### Create config file
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
This is located in `app/config.js`.

For production (using tomcat) use the prod object, else the dev object.

##### BASE_APP_NAME
This is the basename of where the app is located, used by routes. If it's hosted at `http://localhost:8080/dhis-appstore` this should be `/dhis-appstore`.
```
BASE_APP_NAME: '/dhis-appstore'
```
##### API_BASE_URL
The endpoint of the backend API to be used. 
```
API_BASE_URL: 'http://localhost:8080/dhis-appstore/api/',
```

##### API_REDIRECT_URL
The URL to be used when auth0 has successfully logged in a user, and is redirected back to the page. Note that this URL needs to be whitelisted on the auth0 side aswell.
```
 API_REDIRECT_URL: 'http://localhost:8080/dhis-appstore/user/'
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

Web API available at `localhost:8080/dhis-appstore/api`.

Frontend at `localhost:8080/dhis-appstore/`.

#### Start the Web API backend independently

```bash
mvn clean install && mvn spring-boot:run
```
Will be available at `localhost:3098/api/apps`.

### Start the front-end UI app independently (dev)

```bash
yarn install
yarn start
```
Will be available at `localhost:9000`. Using webpack-dev-server.

