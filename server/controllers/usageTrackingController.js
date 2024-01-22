const UsageTrackingModel = require('../models/usageTrackingModel');

exports.createUsageTracking = async (ctx) => {
  try {
    const newUsage = ctx.request.body;
    const id = await UsageTrackingModel.create(newUsage);
    ctx.status = 201;
    ctx.body = { UsageID: id, ...newUsage };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getAllUsageTrackings = async (ctx) => {
  try {
    const usages = await UsageTrackingModel.findAll();
    ctx.body = usages;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getUsageTrackingById = async (ctx) => {
  try {
    const { id } = ctx.params;
    const usage = await UsageTrackingModel.findById(id);
    if (usage) {
      ctx.body = usage;
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Usage tracking not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.updateUsageTracking = async (ctx) => {
  try {
    const { id } = ctx.params;
    const updated = await UsageTrackingModel.update(id, ctx.request.body);
    if (updated) {
      ctx.body = { UsageID: id, ...ctx.request.body };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Usage tracking not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.deleteUsageTracking = async (ctx) => {
  try {
    const { id } = ctx.params;
    const deleted = await UsageTrackingModel.remove(id);
    if (deleted) {
      ctx.status = 200;
      ctx.body = { message: 'Usage tracking deleted' };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Usage tracking not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};
