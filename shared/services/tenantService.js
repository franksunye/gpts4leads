const tenantModel = require("../models/tenantModel");
const logger = require("../utils/logger");

async function setStripeCustomerIdForTenant(tenantId, stripeCustomerId) {
 try {
    logger.info(`[tenantService.js] setStripeCustomerIdForTenant: Setting Stripe customer ID for tenantId: ${tenantId}`);

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

async function findTenantUuidByTenantId(tenantId) {
  const tenant = await tenantModel.findById(tenantId);
  return tenant ? tenant.UUID : null;
 }

module.exports = {
 setStripeCustomerIdForTenant,
 findTenantByUserId,
 findTenantUuidByTenantId,
};