const BillingModel = require('../models/billingModel');

exports.createBilling = async (ctx) => {
  try {
    const newBilling = ctx.request.body;
    const id = await BillingModel.create(newBilling);
    ctx.status = 201;
    ctx.body = { BillingID: id, ...newBilling };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getAllBillings = async (ctx) => {
  try {
    const billings = await BillingModel.findAll();
    ctx.body = billings;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getBillingById = async (ctx) => {
  try {
    const { id } = ctx.params;
    const billing = await BillingModel.findById(id);
    if (billing) {
      ctx.body = billing;
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Billing not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.updateBilling = async (ctx) => {
  try {
    const { id } = ctx.params;
    const updated = await BillingModel.update(id, ctx.request.body);
    if (updated) {
      ctx.body = { BillingID: id, ...ctx.request.body };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Billing not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.deleteBilling = async (ctx) => {
  try {
    const { id } = ctx.params;
    const deleted = await BillingModel.remove(id);
    if (deleted) {
      ctx.status = 200;
      ctx.body = { message: 'Billing deleted' };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Billing not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};
