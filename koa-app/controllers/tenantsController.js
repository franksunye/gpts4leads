const TenantModel = require('../../shared/models/tenantModel');

exports.createTenant = async (ctx) => {
  const newTenant = ctx.request.body;
  try {
    const id = await TenantModel.create(newTenant);
    ctx.status = 201;
    ctx.body = { id, ...newTenant };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getAllTenants = async (ctx) => {
  try {
    const tenants = await TenantModel.findAll();
    ctx.body = tenants;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getTenantById = async (ctx) => {
  const { id } = ctx.params;
  try {
    const tenant = await TenantModel.findById(id);
    if (tenant) {
      ctx.body = tenant;
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Tenant not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.updateTenant = async (ctx) => {
  const { id } = ctx.params;
  try {
    const updated = await TenantModel.update(id, ctx.request.body);
    if (updated) {
      ctx.body = { id, ...ctx.request.body };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Tenant not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.deleteTenant = async (ctx) => {
  const { id } = ctx.params;
  try {
    const deleted = await TenantModel.remove(id);
    if (deleted) {
      ctx.status = 200;
      ctx.body = { message: 'Tenant deleted' };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Tenant not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};
