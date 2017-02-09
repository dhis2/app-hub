# App Store for DHIS 2

DHIS 2 app store

# Setup

### Clone the repo
```bash
git clone https://github.com/dhis2/dhis2-appstore.git
```

### Build the project using maven
```bash
mvn clean install
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

auth0.domain: <auth0 domain>
auth0.issuer: <auth0 certificate issuer>
auth0.clientId=<auth0 client id>
auth0.clientSecret=<auth0 client secret>
auth0.base64EncodedSecret: false
auth0.onLogoutRedirectTo: /login
auth0.securedRoute: /manager/*
auth0.loginCallback: /callback
auth0.loginRedirectOnSuccess:/user
auth0.loginRedirectOnFail: /login
auth0.signingAlgorithm: HS256
auth0.authorityStrategy=ROLES
```

### Create postgres database
```sql
CREATE DATABASE appstore_db OWNER dhis;
```

### Run the app store
```bash
mvn spring-boot:run
```
