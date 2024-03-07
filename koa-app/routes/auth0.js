// auth0.js
const { Issuer, Strategy } = require("openid-client");
const Router = require("koa-router");
const jwt = require("jsonwebtoken");

const auth0Settings = require("../../shared/config/auth0-configuration");
const userService = require("../../shared/services/userService");
const logger = require('../../shared/utils/logger'); 

let client;

(async () => {
  const issuer = await Issuer.discover(`https://${auth0Settings.domain}/`);
  client = new issuer.Client({
    client_id: auth0Settings.clientId,
    client_secret: auth0Settings.clientSecret,
    redirect_uris: [auth0Settings.callbackUrl],
    response_types: ["code"],
  });
})();

const router = new Router();

router.get("/login", async (ctx, next) => {
  const authUrl = client.authorizationUrl({
    scope: "openid email profile",
    state: "action=login", // 添加action参数
  });
  logger.info(`[auth0.js] /login: Redirecting to Auth0 login page`);
  ctx.redirect(authUrl);
});

router.get("/register", async (ctx, next) => {
  const authUrl = client.authorizationUrl({
    scope: "openid email profile",
    state: "action=register", // 添加action参数
  });
  logger.info(`[auth0.js] /register: Redirecting to Auth0 registration page`);
  ctx.redirect(authUrl);
});

router.get("/callback", async (ctx, next) => {
  try {
    logger.info(`[auth0.js] /callback: Auth0 callback received`);

    const state = ctx.request.query.state;
    const params = client.callbackParams(ctx.req);
    const tokenSet = await client.callback(auth0Settings.callbackUrl, params, { state: params.state });
    const action = ctx.query.state.split("=")[1];

    const decodedToken = jwt.decode(tokenSet.id_token);
    const email = decodedToken.email;
    const nickname = decodedToken.nickname;

    logger.debug(`[auth0.js] /callback: Decoded token: ${JSON.stringify(decodedToken)}`);

    if (action === "login" || action === "register") {
      let user = await userService.findUserByEmail(email);

      if (!user) {
        logger.info(`[auth0.js] /callback: User not found, creating new user with email: ${email}`);
        const { user: newUser } = await userService.createUserWithTenant(nickname, email);
        user = newUser;
      }
     const tenantId = user.TenantID;

      ctx.session.user = {
        id: user.UserID,
        email: user.Email,
        nickname: user.Username,
        tenantId: user.TenantID,
        idToken: tokenSet.id_token,
        accessToken: tokenSet.access_token,
      };

      logger.info(`[auth0.js] /callback: Redirecting to home page for tenantId: ${tenantId}`);
      ctx.redirect(`/home/${tenantId}`);
    }
  } catch (error) {
    logger.error(`[auth0.js] /callback: Error during Auth0 callback processing: ${error.message}`);
    ctx.status = 500;
    ctx.body =
      "An error occurred during the authentication process. Please try again.";
  }
});

module.exports = router;
