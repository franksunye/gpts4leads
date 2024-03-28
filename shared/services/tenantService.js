const tenantModel = require("../models/tenantModel");
const logger = require("../utils/logger");

async function setStripeCustomerIdForTenant(tenantId, stripeCustomerId) {
 try {
    logger.info(`[tenantService.js] setStripeCustomerIdForTenant: Setting Stripe customer ID for tenantId: ${tenantId}`);

    // 使用tenantModel的update方法更新租户信息
    const result = await tenantModel.update(tenantId, {
      StripeCustomerId: stripeCustomerId,
    });

    if (result[0] === 0) {
      throw new Error("Tenant not found");
    }

    logger.info(`[tenantService.js] setStripeCustomerIdForTenant: Successfully set Stripe customer ID for tenantId: ${tenantId}`);
    return true;
 } catch (error) {
    logger.error(`[tenantService.js] setStripeCustomerIdForTenant: Error setting Stripe customer ID for tenantId: ${tenantId}. Error: ${error.message}`);
    throw error;
 }
}

async function findTenantByUserId(userId) {
    try {
        // 假设tenantModel有一个方法可以通过用户ID找到租户
        const tenant = await tenantModel.findByUserId(userId);
        if (!tenant) {
            throw new Error("Tenant not found");
        }
        return tenant;
    } catch (error) {
        logger.error(`[tenantService.js] findTenantByUserId: Error finding tenant by user ID: ${userId}. Error: ${error.message}`);
        throw error;
    }
}

module.exports = {
 setStripeCustomerIdForTenant,
 findTenantByUserId
};