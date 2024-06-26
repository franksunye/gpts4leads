const tenantModel = require("../models/tenantModel");
const tenantPlanModel = require('../models/tenantPlanModel');
const planModel = require('../models/planModel');
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
  return tenant ? tenant.uuid : null;
 }

async function findTenantIdByUuid(tenantUuid) {
  try {
     const tenant = await tenantModel.findByUuid(tenantUuid);
     if (!tenant) {
       logger.error(`[tenantService.js] findTenantIdByUuid: Tenant not found for tenantUuid: ${tenantUuid}`);
       throw new Error('Tenant not found');
     }
     return tenant.tenant_id;
  } catch (error) {
     logger.error(`[tenantService.js] findTenantIdByUuid: Error finding tenant ID for tenantUuid: ${tenantUuid}. Error: ${error.message}`);
     throw error;
  }
}

async function getPlanDetailsByTenantUUID(tenantUUID) {
  try {
     logger.info(`[tenantService.js] getPlanDetailsByTenantUUID: Starting to fetch plan details for tenantUUID: ${tenantUUID}`);
 
     const tenantId = await this.findTenantIdByUuid(tenantUUID);
     const planId = await tenantPlanModel.getPlanIdByTenantId(tenantId);
     const planDetails = await planModel.findById(planId);
     
     logger.info(`[tenantService.js] getPlanDetailsByTenantUUID: Successfully fetched plan details for tenantUUID: ${tenantUUID}`);
 
     return planDetails;
  } catch (error) {
     logger.error(`[tenantService.js] getPlanDetailsByTenantUUID: Error fetching plan details for tenantUUID: ${tenantUUID}. Error: ${error.message}`);
     throw error; // 或者处理错误的其他方式
  }
 }
 

module.exports = {
 setStripeCustomerIdForTenant,
 findTenantByUserId,
 findTenantUuidByTenantId,
 findTenantIdByUuid,
 getPlanDetailsByTenantUUID,
};