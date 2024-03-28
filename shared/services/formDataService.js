// formDataService.js
const FormDataModel = require('../models/formDataModel');
const logger = require('../utils/logger');

exports.getFormDataById = async (formId) => {
    try {
        logger.info(`[formDataService.js] getFormDataById: Fetching form data for formId: ${formId}`);
        const formData = await FormDataModel.getFormDataById(formId);
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
        const parsedData = JSON.parse(formData.Data);
        // 合并解析后的数据和原始对象
        return {
            ...formData,
            ...parsedData,
            // 移除原始的Data字段
            Data: undefined
        };
    });
};