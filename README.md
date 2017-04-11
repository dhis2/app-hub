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

### Create postgres database (if you do not have one yet)
```sql
CREATE DATABASE appstore_db OWNER dhis;
```

### Run the project
```bash
mvn clean install && mvn spring-boot:run
```

### Start the front-end development app-store
```bash
yarn start
```
