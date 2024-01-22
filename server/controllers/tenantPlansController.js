const TenantPlanModel = require('../models/tenantPlanModel');

exports.createTenantPlan = async (ctx) => {
  try {
    const newTenantPlan = ctx.request.body;
    const id = await TenantPlanModel.create(newTenantPlan);
    ctx.status = 201;
    ctx.body = { TenantPlanID: id, ...newTenantPlan };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getAllTenantPlans = async (ctx) => {
  try {
    const tenantPlans = await TenantPlanModel.findAll();
    ctx.body = tenantPlans;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getTenantPlanById = async (ctx) => {
  try {
    const { id } = ctx.params;
    const tenantPlan = await TenantPlanModel.findById(id);
    if (tenantPlan) {
      ctx.body = tenantPlan;
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Tenant plan not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.updateTenantPlan = async (ctx) => {
  try {
    const { id } = ctx.params;
    const updated = await TenantPlanModel.update(id, ctx.request.body);
    if (updated) {
      ctx.body = { TenantPlanID: id, ...ctx.request.body };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Tenant plan not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.deleteTenantPlan = async (ctx) => {
  try {
    const { id } = ctx.params;
    const deleted = await TenantPlanModel.remove(id);
    if (deleted) {
      ctx.status = 200;
      ctx.body = { message: 'Tenant plan deleted' };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Tenant plan not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};
