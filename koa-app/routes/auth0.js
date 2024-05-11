// auth0.js
const { Issuer, Strategy } = require("openid-client");
const Router = require("koa-router");
const jwt = require("jsonwebtoken");

const auth0Settings = require("../../shared/config/auth0-configuration");
const userService = require("../../shared/services/userService");
const tenantService = require("../../shared/services/tenantService");
const logger = require('../../shared/utils/logger'); 
const stripe = require('../../shared/utils/stripe');

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

    // const state = ctx.request.query.state;
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
        // const { user: newUser } = await userService.createUserWithTenant(nickname, email);
        const { user: newUser } = await userService.createUserWithTenantAndPlan(nickname, email, 1);
        
        user = newUser;
      }
     const tenantId = user.tenant_id;
     const tenantUuid = await tenantService.findTenantUuidByTenantId(tenantId);

     await getSubscriptionInfoAndSaveToSession(ctx, user.user_id);

     ctx.session.user = {
        id: user.user_id,
        email: user.email,
        nickname: user.username,
        tenantId: user.tenant_id,
        tenantUuid: tenantUuid,
        idToken: tokenSet.id_token,
        accessToken: tokenSet.access_token,
      };
      
      logger.debug(`[auth0.js] /callback: Current session info: ${JSON.stringify(ctx.session)}`);
      logger.info(`[auth0.js] /callback: Redirecting to home page for tenantId: ${tenantId}`);
      logger.info(`[auth0.js] /callback: Redirecting to home page for tenantUuid: ${tenantUuid}`);

      ctx.redirect(`/home/${tenantUuid}`);
    }
  } catch (error) {
    logger.error(`[auth0.js] /callback: Error during Auth0 callback processing: ${error.message}`);
    ctx.status = 500;
    ctx.body =
      "An error occurred during the authentication process. Please try again.";
  }
});

async function getSubscriptionInfoAndSaveToSession(ctx, userId) {
  try {
     logger.info(`[auth0.js] getSubscriptionInfoAndSaveToSession: Fetching subscription info for userId: ${userId}`);
 
     // 获取租户信息
     const tenantInfo = await userService.getTenantInfoByUserId(userId);
     logger.debug(`[auth0.js] getSubscriptionInfoAndSaveToSession: Tenant info: ${JSON.stringify(tenantInfo)}`);
     const stripeCustomerId = tenantInfo.StripeCustomerId;
     
     if (!stripeCustomerId) {
      logger.warn(`[auth0.js] getSubscriptionInfoAndSaveToSession: No Stripe customer ID found for userId: ${userId}`);
      return; // 如果没有Stripe客户ID，则直接返回，不进行后续操作
    }

     logger.debug(`[auth0.js] getSubscriptionInfoAndSaveToSession: Stripe customer ID: ${stripeCustomerId}`);
 
     // 使用Stripe API获取订阅信息
     const subscriptions = await stripe.subscriptions.list({ customer: stripeCustomerId });
 
     logger.debug(`[auth0.js] getSubscriptionInfoAndSaveToSession: Fetched subscriptions: ${JSON.stringify(subscriptions.data)}`);
 
     // 假设用户只有一个订阅，获取第一个订阅的状态和套餐
     if (subscriptions.data.length > 0) {
       const subscription = subscriptions.data[0];
       const subscriptionStatus = subscription.status;
       const productId = subscription.items.data[0].plan.product; // 注意这个路径可能根据实际返回的数据结构有所不同
       const product = await stripe.products.retrieve(productId);
       const productName = product.name;

       logger.info(`[auth0.js] getSubscriptionInfoAndSaveToSession: Subscription status: ${subscriptionStatus}, Product Name: ${productName}`);
 
       ctx.session.subscription = {
        status: subscriptionStatus,
        plan: productName, // 使用产品名称替换之前的套餐（plan）名称或昵称（nickname）
      };
 
       logger.info(`[auth0.js] getSubscriptionInfoAndSaveToSession: Subscription info saved to session.`);
     } else {
       logger.warn(`[auth0.js] getSubscriptionInfoAndSaveToSession: No subscriptions found for userId: ${userId}`);
     }
  } catch (error) {
     logger.error(`[auth0.js] getSubscriptionInfoAndSaveToSession: Error fetching subscription info: ${error.message}`);
     // 处理错误，例如将错误信息保存到session或返回错误响应
  }
 }

module.exports = router;
