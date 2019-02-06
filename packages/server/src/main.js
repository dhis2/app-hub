const Knex = require('knex')
const Hapi = require('hapi')
const Pino = require('hapi-pino')
const Boom = require('boom')

const jwt = require('hapi-auth-jwt2');
const jwksRsa = require('jwks-rsa');

const Inert = require('inert');
const Vision = require('vision');
const Blipp = require('blipp')
const HapiSwagger = require('hapi-swagger');

const HapiApiVersion = require('hapi-api-version')

const api_v1 = require('./routes/v1')
const api_v2 = require('./routes/v2')

const { flatten } = require('./utils')

const routes = flatten([api_v1.routes, api_v2.routes]);

const db = Knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'appstore',
        password: 'appstore123',
        database: 'appstore',
    },
})

// server things before start

const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
        cors: {
             //TODO: load the URLs from database or something, so we can dynamically manage these
            origin: ['http://localhost:9000']  
        }
    }
})

/* const validateUser = (decoded, request, callback) => {
    // This is a simple check that the `sub` claim
    // exists in the Access Token. Modify it to suit
    // the needs of your application
    if (decoded && decoded.sub) {
      if (decoded.scope)
        return callback(null, true, {
          scope: decoded.scope.split(' ')
        })
  
      return callback(null, true);
    }
  
    return callback(null, false);
  } */



server.bind({
    db,
})

server.route(routes)

// kick it

const init = async () => {
    await server.register({
        plugin: Pino,
        options: {
            prettyPrint: true,
            logEvents: ['response', 'onPostStart'],
        },        
    })

    await server.register({
        plugin: HapiApiVersion,
        options: require('./options').apiVersions
    })


    //Swagger
    await server.register([
        Inert,
        Vision,
        Blipp,
        {
            plugin: HapiSwagger,
            options: require('./options').swaggerOptions
        }
    ]);

/*     await server.register(jwt, err => {
        if (err) throw err;
        server.auth.strategy('jwt', 'jwt', 'required', {
          complete: true,
          // verify the Access Token against the
          // remote Auth0 JWKS
          key: jwksRsa.hapiJwt2Key({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://dhis2.eu.auth0.com/.well-known/jwks.json` //TODO: move to config/env var
          }),
          verifyOptions: {
            audience: 'https://dhis2.eu.auth0.com/api/v2/',
            issuer: `https://dhis2.eu.auth0.com/`,
            algorithms: ['RS256']
          },
          validateFunc: validateUser
        })
        registerRoutes()
      }) */
    
        // Add a route - handler and route definition is the same for all versions
        server.route({
            method: 'GET',
            path: '/version',
            handler: function(request, reply) {
                // Return the api-version which was requested
                return reply({
                    version: request.pre.apiVersion
                });
            }
        });

    await server.start()

    console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', err => {
    console.log(err)
    process.exit(1)
})

init()
