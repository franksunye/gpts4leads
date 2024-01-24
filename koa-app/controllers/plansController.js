const PlanModel = require('../../shared/models/planModel');

exports.createPlan = async (ctx) => {
  try {
    const newPlan = ctx.request.body;
    const id = await PlanModel.create(newPlan);
    ctx.status = 201;
    ctx.body = { PlanID: id, ...newPlan };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getAllPlans = async (ctx) => {
  try {
    const plans = await PlanModel.findAll();
    ctx.body = plans;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getPlanById = async (ctx) => {
  try {
    const { id } = ctx.params;
    const plan = await PlanModel.findById(id);
    if (plan) {
      ctx.body = plan;
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Plan not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.updatePlan = async (ctx) => {
  try {
    const { id } = ctx.params;
    const updated = await PlanModel.update(id, ctx.request.body);
    if (updated) {
      ctx.body = { PlanID: id, ...ctx.request.body };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Plan not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.deletePlan = async (ctx) => {
  try {
    const { id } = ctx.params;
    const deleted = await PlanModel.remove(id);
    if (deleted) {
      ctx.status = 200;
      ctx.body = { message: 'Plan deleted' };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Plan not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};
