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

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};
