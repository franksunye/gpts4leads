// controllers/stripeWebhook.js
const stripe = require('../../shared/utils/stripe');
const logger = require('../../shared/utils/logger');
const tenantService = require('../../shared/services/tenantService');
const userService = require('../../shared/services/userService');

async function handleStripeWebhook(ctx) {
    // console.log('Received webhook request:', ctx.request.headers); // 记录请求头信息
    const sig = ctx.headers['stripe-signature']; // 获取Stripe签名头
    // console.log('Stripe Signature:', sig); // 添加日志
    // console.log('Raw Body:', ctx.request.rawBody); // 添加日志
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(ctx.request.rawBody, sig, 'whsec_2d6cf52901bc907e1da687e8ff7ec3cdeb98bc57649c107a91871cf6cf3de31d');
        // logger.info(`[stripeWebhook.js] Constructed event: ${JSON.stringify(event)}`); // 记录构建的事件
    } catch (err) {
        ctx.status = 400;
        ctx.body = `Webhook Error: ${err.message}`;
        logger.error(`[stripeWebhook.js] Error constructing event: ${err.message}`); // 记录构建事件时的错误
        return;
    }
    
    logger.info(`[stripeWebhook.js] Event type: ${event.type}`); // 记录事件类型
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        logger.info(`[stripeWebhook.js] Payment received for session ${session.id} with data: ${JSON.stringify(session)}`); // 记录支付成功的信息和数据
        const userEmail = session.customer_email;
        logger.info(`[stripeWebhook.js] User Email from Stripe Session: ${userEmail}`); // 记录用户电子邮件地址
        userService.findUserByEmail(userEmail)
        .then(user => {
            if (user) {
                // 使用用户的tenantId更新租户的Stripe客户ID
                logger.debug(`[stripeWebhook.js] User found: ${JSON.stringify(user)}`);
                tenantService.setStripeCustomerIdForTenant(user.tenant_id, session.customer)
                    .then(() => {
                        logger.info(`[stripeWebhook.js] Tenant updated with customer ID: ${session.customer}`);
                    })
                    .catch(err => {
                        logger.error(`[stripeWebhook.js] Error updating tenant: ${err.message}`);
                    });
            } else {
                logger.error(`[stripeWebhook.js] User not found with email: ${userEmail}`);
            }
        })
        .catch(err => {
            logger.error(`[stripeWebhook.js] Error finding user by email: ${err.message}`);
        });
    }
    
    ctx.status = 200;
}

module.exports = {
 handleStripeWebhook,
};