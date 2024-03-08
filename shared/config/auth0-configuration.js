// auth0-configuration.js
const auth0Settings = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackUrl: process.env.AUTH0_CALLBACK_URL,
  logoutUrl: process.env.AUTH0_LOGOUT_URL
 };
  
  module.exports = auth0Settings;
  