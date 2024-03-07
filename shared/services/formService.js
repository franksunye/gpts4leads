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