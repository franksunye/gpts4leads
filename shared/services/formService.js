// formService.js
const FormModel = require('../models/formModel');
const logger = require('../utils/logger'); 

exports.getFormsByTenantId = async (tenantId) => {
  try {
    logger.info(`[formService.js] getFormsByTenantId: Fetching forms for tenantId: ${tenantId}`);
    const forms = await FormModel.findByTenantId(tenantId);
    logger.info(`[formService.js] getFormsByTenantId: Successfully fetched forms for tenantId: ${tenantId}`);
    return forms;
  } catch (error) {
    logger.error(`[formService.js] getFormsByTenantId: Error fetching forms for tenantId: ${tenantId}. Error: ${error.message}`);
    throw error; //  或者处理错误，例如返回null或抛出错误
  }
};

exports.getFormsByTenantIdWithPagination = async (tenantId, offset, limit = 10) => {

  logger.debug(`[formService.js] getFormsByTenantIdWithPagination: Debugging info for tenantId: ${tenantId}`);
  logger.debug(`[formService.js] getFormsByTenantIdWithPagination: Limit: ${limit}, Type: ${typeof limit}`);
  logger.debug(`[formService.js] getFormsByTenantIdWithPagination: Offset: ${offset}, Type: ${typeof offset}`);

  try {
     logger.info(`[formService.js] getFormsByTenantIdWithPagination: Fetching forms for tenantId: ${tenantId}`);
     const forms = await FormModel.findByTenantIdWithPagination(tenantId, offset, limit);
     logger.info(`[formService.js] getFormsByTenantIdWithPagination: Successfully fetched forms for tenantId: ${tenantId}`);
     return forms;
  } catch (error) {
     logger.error(`[formService.js] getFormsByTenantIdWithPagination: Error fetching forms for tenantId: ${tenantId}. Error: ${error.message}`);
     throw error;
  }
 };

 exports.countFormsByTenantId = async (tenantId) => {
  try {
     logger.info(`[formService.js] countFormsByTenantId: Counting forms for tenantId: ${tenantId}`);
     const result = await FormModel.countFormsByTenantId(tenantId);
     const count = result[0].count;
     logger.info(`[formService.js] countFormsByTenantId: Successfully counted forms for tenantId: ${tenantId}`);
     return count;
  } catch (error) {
     logger.error(`[formService.js] countFormsByTenantId: Error counting forms for tenantId: ${tenantId}. Error: ${error.message}`);
     throw error;
  }
 };