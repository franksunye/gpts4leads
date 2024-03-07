// controllers/stripeWebhook.js
const stripe = require('../../shared/utils/stripe'); // 根据实际路径调整

async function handleStripeWebhook(ctx) {
    // console.log('Received webhook request:', ctx.request.headers); // 记录请求头信息
    const sig = ctx.headers['stripe-signature']; // 获取Stripe签名头
    // console.log('Stripe Signature:', sig); // 添加日志
    // console.log('Raw Body:', ctx.request.rawBody); // 添加日志
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(ctx.request.rawBody, sig, 'whsec_2d6cf52901bc907e1da687e8ff7ec3cdeb98bc57649c107a91871cf6cf3de31d');
        // console.log('Constructed event:', event); // 记录构建的事件
    } catch (err) {
        ctx.status = 400;
        ctx.body = `Webhook Error: ${err.message}`;
        console.error('Error constructing event:', err); // 记录构建事件时的错误
        return;
    }
    
    console.log('Event type:', event.type); // 记录事件类型
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log(`Payment received for session ${session.id} with data:`, session); // 记录支付成功的信息和数据
        // 在这里处理支付成功的逻辑，例如更新数据库中的订单状态
    }
    
    ctx.status = 200;
}

module.exports = {
 handleStripeWebhook,
};