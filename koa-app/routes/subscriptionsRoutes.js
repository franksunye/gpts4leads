const Router = require('koa-router');
const stripe = require('../../shared/utils/stripe'); // 引入你刚才创建的Stripe配置模块
const router = new Router();
const { handleStripeWebhook } = require('../controllers/stripeWebhook'); 
const logger = require('../../shared/utils/logger');

router.post('/api/stripe/webhook', handleStripeWebhook);


// 创建订阅
router.post('/api/subscribe', async (ctx) => {
  const { planId, customerId } = ctx.request.body;

  try {
    const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ plan: planId }],
        default_payment_method: 'pm_1Omuqn2AzALaGMQIZPzNu6Fu',
      });

    logger.info(`[subscriptionsRoutes.js] /api/subscribe: Subscription created successfully for customerId: ${customerId}`);      
    ctx.body = subscription;
  } catch (error) {
    logger.error(`[subscriptionsRoutes.js] /api/subscribe: Error creating subscription. Error: ${error.message}`);
    ctx.status = 500;
    ctx.body = { error: '创建订阅时发生错误' };
  }
});

// 更改订阅
router.post('/api/subscribe/change', async (ctx) => {
    const { subscriptionId, newPlanId } = ctx.request.body;
  
    try {
      // 首先获取当前订阅的详情
      const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      // 使用当前订阅的详情来获取订阅项ID
      const subscriptionItemId = currentSubscription.items.data[0].id;
  
      // 然后使用订阅项ID来更新订阅
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
        items: [{
          id: subscriptionItemId,
          plan: newPlanId,
        }],
        default_payment_method: 'pm_1Omuqn2AzALaGMQIZPzNu6Fu',
      });
  
      ctx.body = updatedSubscription;
    } catch (error) {
      logger.error(`[subscriptionsRoutes.js] /api/subscribe/change: Error while changing subscription. Error: ${error.message}`);
      ctx.status = 500;
      ctx.body = { error: '更改订阅时发生错误' };
    }
  });
  

// 取消订阅
router.post('/api/subscribe/cancel', async (ctx) => {
    const { subscriptionId } = ctx.request.body;
  
    try {
      // Cancel the subscription immediately
      const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
  
      ctx.body = canceledSubscription;
    } catch (error) {
      logger.error(`[subscriptionsRoutes.js] /api/subscribe/cancel: Error while cancelling subscription. Error: ${error.message}`);
      ctx.status = 500;
      ctx.body = { error: '取消订阅时发生错误' };
    }
  });
  

// 新增API接口：列出所有定价计划
router.get('/api/plans', async (ctx) => {
    try {
      const plans = await stripe.plans.list({ limit: 10 }); // 你可以根据需要调整limit参数
      ctx.status = 200;
      ctx.body = plans;
    } catch (error) {
      logger.error(`[subscriptionsRoutes.js] /api/plans: Error retrieving plans. Error: ${error.message}`);
      ctx.status = 500;
      ctx.body = { error: '获取定价计划时发生错误' };
    }
  });

module.exports = router;
