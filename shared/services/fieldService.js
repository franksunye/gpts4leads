const FieldModel = require('../models/fieldModel');
const logger = require('../utils/logger');

exports.getFieldsByFormId = async (formId) => {
    try {
       logger.info(`[fieldService.js] getFieldsByFormId: Fetching fields for formId: ${formId}`);
       const fields = await FieldModel.findByFormId(formId);
       logger.debug(`[fieldService.js] getFieldsByFormId: Fetched fields for formId: ${formId}. Fields: ${JSON.stringify(fields)}`);
       logger.info(`[fieldService.js] getFieldsByFormId: Successfully fetched fields for formId: ${formId}`);
       return fields;
    } catch (error) {
       logger.error(`[fieldService.js] getFieldsByFormId: Error fetching fields for formId: ${formId}. Error: ${error.message}`);
       throw error;
    }
   };