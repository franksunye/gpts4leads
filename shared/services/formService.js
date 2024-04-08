// formService.js
const FormModel = require('../models/formModel');
const logger = require('../utils/logger'); 

const tenantService = require('../services/tenantService');

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

 exports.getFormIdByUuid = async (formUuid) => {
   try {
      logger.info(`[formService.js] getFormIdByUuid: Fetching formId for formUuid: ${formUuid}`);
      const form = await FormModel.findByUuid(formUuid);
      if (!form) {
        logger.error(`[formService.js] getFormIdByUuid: Form not found for formUuid: ${formUuid}`);
        return null; // 或者抛出一个错误
      }
      const formId = form.FormID
      logger.info(`[formService.js] getFormIdByUuid: Successfully fetched formId: ${formId} for formUuid: ${formUuid}`);
      return formId;
   } catch (error) {
      logger.error(`[formService.js] getFormIdByUuid: Error fetching formId for formUuid: ${formUuid}. Error: ${error.message}`);
      throw error;
   }
  };

  exports.deleteFormsByTenantUuid = async (tenantUuid) => {
   try {
      const tenantId = await tenantService.findTenantIdByUuid(tenantUuid);
      if (!tenantId) {
        logger.error(`[formService.js] deleteFormsByTenantUuid: Tenant not found for tenantId: ${tenantId}`);
        throw new Error('Tenant not found');
      }
  
      await FormModel.softDeleteMany({ tenantId: tenantId });
      logger.info(`[formService.js] deleteFormsByTenantUuid: Successfully deleted forms for tenantId: ${tenantId}`);
   } catch (error) {
      logger.error(`[formService.js] deleteFormsByTenantId: Error deleting forms for tenantUuid: ${tenantUuid}. Error: ${error.message}`);
      throw error;
   }
  };  

  exports.getFormsByTenantIdWithPaginationAndCount = async (tenantId, offset, limit = 10) => {
   try {
      logger.info(`[formService.js] getFormsByTenantIdWithPaginationAndCount: Fetching forms for tenantId: ${tenantId}`);
      
      const startTime = new Date();

      const forms = await FormModel.fetchFormsWithDataCount(tenantId, offset, limit);

      const formsJson = JSON.stringify(forms, null, 2); // The second argument (null) is a replacer function that transforms the results, and the third argument (2) specifies the number of spaces for indentation
      logger.debug(`[formService.js] getFormsByTenantIdWithPaginationAndCount: Debugging forms data for tenantId: ${tenantId}\n${formsJson}`);

      const endTime = new Date();
      const elapsedTime = endTime - startTime;      

      logger.info(`[formService.js] getFormsByTenantIdWithPaginationAndCount: Successfully fetched forms for tenantId: ${tenantId}. Elapsed time: ${elapsedTime} ms`);
      return forms;
   } catch (error) {
      logger.error(`[formService.js] getFormsByTenantIdWithPaginationAndCount: Error fetching forms for tenantId: ${tenantId}. Error: ${error.message}`);
      throw error;
   }
  };