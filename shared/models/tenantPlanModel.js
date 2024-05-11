const knex = require('../database');

const create = (tenantPlanData) => {
  return knex('tenant_plans').insert(tenantPlanData);
};

const findAll = () => {
  return knex('tenant_plans').insert(tenantPlanData);
};

const findById = (id) => {
  return knex('tenant_plans').select('*').where('tenant_plan_id', id).first();
};

const update = (id, tenantPlanData) => {
  return knex('tenant_plans').where('tenant_plan_id', id).update(tenantPlanData);
};

const remove = (id) => {
  return knex('tenant_plans').where('tenant_plan_id', id).del();
};

const getPlanIdByTenantId = async (tenantId) => {
  try {
     const tenantPlan = await knex('tenant_plans').where('tenant_id', tenantId).first();
     if (!tenantPlan) {
       throw new Error('Tenant plan not found');
     }
     return tenantPlan.plan_id;
  } catch (error) {
     throw error; // 或者处理错误的其他方式
  }
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  getPlanIdByTenantId,
};
