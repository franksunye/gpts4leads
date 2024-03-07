const FormModel = require('../../shared/models/formModel');
const formService = require('../../shared/services/formService');
const logger = require('../../shared/utils/logger');

exports.createForm = async (ctx) => {
  try {
    const newForm = ctx.request.body;
    const id = await FormModel.create(newForm);
    ctx.status = 201;
    ctx.body = { id, ...newForm };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getAllForms = async (ctx) => {
  try {
    const forms = await FormModel.findAll();
    ctx.body = forms;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getFormById = async (ctx) => {
  try {
    const { id } = ctx.params;
    const form = await FormModel.findById(id);
    if (form) {
      ctx.body = form;
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Form not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.updateForm = async (ctx) => {
  try {
    const { id } = ctx.params;
    const updated = await FormModel.update(id, ctx.request.body);
    if (updated) {
      ctx.body = { id, ...ctx.request.body };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Form not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.deleteForm = async (ctx) => {
  try {
    const { id } = ctx.params;
    const deleted = await FormModel.remove(id);
    if (deleted) {
      ctx.status = 200;
      ctx.body = { message: 'Form deleted' };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Form not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getFormsByTenantId = async (ctx) => {
  try {
    const tenantId = ctx.params.tenantId; //   从URL参数中获取租户ID
    logger.info(`[formService.js] getFormsByTenantId: Fetching forms for tenantId: ${tenantId}`);
    const forms = await formService.getFormsByTenantId(tenantId);
    logger.info(`[formService.js] getFormsByTenantId: Successfully fetched forms for tenantId: ${tenantId}`);
    ctx.body = forms;
  } catch (error) {
    logger.error(`[formService.js] getFormsByTenantId: Error fetching forms for tenantId: ${tenantId}. Error: ${error.message}`);
    ctx.status =  500;
    ctx.body = { message: error.message };
  }
};