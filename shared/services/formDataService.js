// shared/services/formDataService.js
const FormDataModel = require('../models/formDataModel');
const logger = require('../utils/logger');

exports.getFormDataById = async (formId) => {
    try {
        logger.info(`[formDataService.js] getFormDataById: Fetching form data for formId: ${formId}`);
        let formData = await FormDataModel.getFormDataById(formId);
        // 转换数据结构
        formData = exports.transformFormData(formData);
        logger.debug(`[formDataService.js] getFormDataById: Form data for formId: ${formId} - ${JSON.stringify(formData, null, 2)}`);
        logger.info(`[formDataService.js] getFormDataById: Successfully fetched form data for formId: ${formId}`);
        return formData;
    } catch (error) {
        logger.error(`[formDataService.js] getFormDataById: Error fetching form data for formId: ${formId}. Error: ${error.message}`);
        throw error;
    }
};

exports.getFormDataByIdWithPagination = async (formId, offset, limit = 10) => {
    try {
        logger.info(`[formDataService.js] getFormDataByIdWithPagination: Fetching form data for formId: ${formId}`);
        let formData = await FormDataModel.getFormDataByIdWithPagination(formId, offset, limit);
        console.log('formData:', formData); // 打印获取的formData

        // 转换数据结构
        formData = exports.transformFormData(formData);
        logger.debug(`[formDataService.js] getFormDataByIdWithPagination: Form data for formId: ${formId} - ${JSON.stringify(formData, null, 2)}`);
        logger.info(`[formDataService.js] getFormDataByIdWithPagination: Successfully fetched form data for formId: ${formId}`);
        return formData;
    } catch (error) {
        logger.error(`[formDataService.js] getFormDataByIdWithPagination: Error fetching form data for formId: ${formId}. Error: ${error.message}`);
        throw error;
    }
};

exports.getFormDataByUuidWithPagination = async (uuid, offset, limit = 10) => {
    try {
       logger.info(`[formDataService.js] getFormDataByUuidWithPagination: Fetching form data for UUID: ${uuid}`);
       let formData = await FormDataModel.getFormDataByUuidWithPagination(uuid, offset, limit);
       // 转换数据结构
       formData = exports.transformFormData(formData);
       logger.debug(`[formDataService.js] getFormDataByUuidWithPagination: Form data for UUID: ${uuid} - ${JSON.stringify(formData, null, 2)}`);
       logger.info(`[formDataService.js] getFormDataByUuidWithPagination: Successfully fetched form data for UUID: ${uuid}`);
       return formData;
    } catch (error) {
       logger.error(`[formDataService.js] getFormDataByUuidWithPagination: Error fetching form data for UUID: ${uuid}. Error: ${error.message}`);
       throw error;
    }
   };
   
exports.countFormDataByFormId = async (formId) => {
    try {
        logger.info(`[formDataService.js] countFormDataByFormId: Counting form data for formId: ${formId}`);
        const result = await FormDataModel.countFormDataByFormId(formId);
        const count = result[0].count;
        logger.info(`[formDataService.js] countFormDataByFormId: Successfully counted form data for formId: ${formId}`);
        return count;
    } catch (error) {
        logger.error(`[formDataService.js] countFormDataByFormId: Error counting form data for formId: ${formId}. Error: ${error.message}`);
        throw error;
    }
};

exports.transformFormData = (formDataArray) => {
    return formDataArray.map(formData => {
        // 解析Data字段中的JSON字符串
        const parsedData = JSON.parse(formData.data);
        // 合并解析后的数据和原始对象
        return {
            ...formData,
            ...parsedData,
            // 移除原始的Data字段
            data: undefined
        };
    });
};

exports.countFormDataByTenantId = async (tenantId) => {
    try {
        logger.info(`[formDataService.js] countFormDataByTenantId: Counting form data for tenantId: ${tenantId}`);
        const count = await FormDataModel.countFormDataByTenantId(tenantId);
        logger.info(`[formDataService.js] countFormDataByTenantId: Count for tenantId ${tenantId}: ${count}`);

        logger.info(`[formDataService.js] countFormDataByTenantId: Successfully counted form data for tenantId: ${tenantId}`);
        return count;
    } catch (error) {
        logger.error(`[formDataService.js] countFormDataByTenantId: Error counting form data for tenantId: ${tenantId}. Error: ${error.message}`);
        throw error;
    }
};

exports.countUniqueFieldByTenantId = async (tenantId, fieldName) => {
    try {
        logger.info(`[formDataService.js] countUniqueFieldByTenantId: Counting unique ${fieldName} for tenantId: ${tenantId}`);
        const allDataFields = await FormDataModel.getAllDataFieldsByTenantId(tenantId);
        // logger.debug(`[formDataService.js] countUniqueFieldByTenantId: Retrieved all data fields for tenantId ${tenantId}: ${JSON.stringify(allDataFields, null, 2)}`);

        // 根据传入的fieldName从数据中提取相应的字段值
        const fieldValues = allDataFields.map(data => {
            const parsedData = JSON.parse(data);
            return parsedData[fieldName];
          });
        // logger.debug(`[formDataService.js] countUniqueFieldByTenantId: Extracted field values for fieldName ${fieldName}: ${JSON.stringify(fieldValues, null, 2)}`);

        // 计算这些值的唯一数量
        const uniqueFieldValues = [...new Set(fieldValues)];
        // logger.debug(`[formDataService.js] countUniqueFieldByTenantId: Unique field values for fieldName ${fieldName}: ${JSON.stringify(uniqueFieldValues, null, 2)}`);

        const count = uniqueFieldValues.length;
        logger.info(`[formDataService.js] countUniqueFieldByTenantId: Count of unique ${fieldName} for tenantId ${tenantId}: ${count}`);
        logger.info(`[formDataService.js] countUniqueFieldByTenantId: Successfully counted unique ${fieldName} for tenantId: ${tenantId}`);
        return count;
    } catch (error) {
        logger.error(`[formDataService.js] countUniqueFieldByTenantId: Error counting unique ${fieldName} for tenantId: ${tenantId}. Error: ${error.message}`);
        throw error;
    }
};

exports.getFormDataCountByDateRange = async (tenantId, startDate, endDate) => {
    try {
        const result = await FormDataModel.getFormDataCountByDateRange(tenantId, startDate, endDate);
        // logger.info(`[formDataService.js] getFormDataCountByDateRange: Count by date range from ${startDate} to ${endDate} for tenantId ${tenantId}: ${JSON.stringify(result, null, 2)}`);
        return result;
    } catch (error) {
        logger.error(`[formDataService.js] getFormDataCountByDateRange: Error getting form data count by date range for tenantId ${tenantId}. Error: ${error.message}`);
        throw error;
    }
};

exports.getFormDataCountByDateRangeAndUniqueField = async (tenantId, uniqueField, startDate, endDate) => {
    try {
        const result = await FormDataModel.getFormDataCountByDateRangeAndUniqueField(tenantId, uniqueField, startDate, endDate);
        // logger.info(`[formDataService.js] getFormDataCountByDateRangeAndUniqueField: Count by date range from ${startDate} to ${endDate} for tenantId ${tenantId} and unique field ${uniqueField}: ${JSON.stringify(result, null, 2)}`);
        return result;
    } catch (error) {
        logger.error(`[formDataService.js] getFormDataCountByDateRangeAndUniqueField: Error getting form data count by date range for tenantId ${tenantId} and unique field ${uniqueField}. Error: ${error.message}`);
        throw error;
    }
};