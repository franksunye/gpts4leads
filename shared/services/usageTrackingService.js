// usageTrackingService.js
const UsageTrackingModel = require('../models/usageTrackingModel');

const logger = require('../utils/logger'); 

const tenantService = require('../services/tenantService');

exports.getUsageByTenantUUID = async (tenantUUID) => {
    try {
       logger.info(`[usageTrackingService.js] getUsageByTenantUUID: Fetching usage for tenantUUID: ${tenantUUID}`);
       const tenantId = await tenantService.findTenantIdByUuid(tenantUUID);
       const usages = await UsageTrackingModel.getUsageByTenantId(tenantId);
       logger.info(`[usageTrackingService.js] getUsageByTenantUUID: Successfully fetched usage for tenantUUID: ${tenantUUID}`);
       return usages;
    } catch (error) {
       logger.error(`[usageTrackingService.js] getUsageByTenantUUID: Error fetching usage for tenantUUID: ${tenantUUID}. Error: ${error.message}`);
       throw error;
    }
   };

exports.updateUsageByTenantUUID = async (tenantUUID, newUsageData) => {
      try {
          logger.info(`[usageTrackingService.js] updateUsageByTenantUUID: Updating usage for tenantUUID: ${tenantUUID}`);
          const tenantId = await tenantService.findTenantIdByUuid(tenantUUID);
          await UsageTrackingModel.updateUsageByTenantId(tenantId, newUsageData);
          logger.info(`[usageTrackingService.js] updateUsageByTenantUUID: Successfully updated usage for tenantUUID: ${tenantUUID}`);
      } catch (error) {
          logger.error(`[usageTrackingService.js] updateUsageByTenantUUID: Error updating usage for tenantUUID: ${tenantUUID}. Error: ${error.message}`);
          throw error;
      }
  };