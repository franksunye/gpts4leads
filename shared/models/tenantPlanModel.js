const knex = require('../database');

const create = (tenantPlanData) => {
  return knex('TenantPlans').insert(tenantPlanData);
};

const findAll = () => {
  return knex('TenantPlans').select('*');
};

const findById = (id) => {
  return knex('TenantPlans').select('*').where('TenantPlanID', id).first();
};

const update = (id, tenantPlanData) => {
  return knex('TenantPlans').where('TenantPlanID', id).update(tenantPlanData);
};

const remove = (id) => {
  return knex('TenantPlans').where('TenantPlanID', id).del();
};

const getPlanIdByTenantId = async (tenantId) => {
  try {
     const tenantPlan = await knex('TenantPlans').where('TenantID', tenantId).first();
     if (!tenantPlan) {
       throw new Error('Tenant plan not found');
     }
     return tenantPlan.PlanID;
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
