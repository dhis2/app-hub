var ManagementClient = require('auth0').ManagementClient;
var auth0 = new ManagementClient({
  domain: '{YOUR_ACCOUNT}.auth0.com',
  clientId: '{YOUR_NON_INTERACTIVE_CLIENT_ID}',
  clientSecret: '{YOUR_NON_INTERACTIVE_CLIENT_SECRET}',
  scope: 'read:users update:users'
});

