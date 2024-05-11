const knex = require('../database');

const create = (usageData) => {
  return knex('usage_tracking').insert(usageData);
};

const findAll = () => {
  return knex('usage_tracking').select('*');
};

const findById = (id) => {
  return knex('usage_tracking').select('*').where('usage_id', id).first();
};

const update = (id, usageData) => {
  usageData.Date = knex.raw('CURRENT_TIMESTAMP');
  return knex('usage_tracking').where('usage_id', id).update(usageData);
};

const remove = (id) => {
  return knex('usage_tracking').where('usage_id', id).del();
};

const getUsageByTenantId = (tenantId) => {
  return knex('usage_tracking').select('*').where('tenant_id', tenantId).first();
};

const updateUsageByTenantId = async (tenantId, newUsageData) => {
  try {
      // 更新数据库中对应租户的使用情况记录
      await knex('usage_tracking')
      .where('tenant_id', tenantId)
      .update(newUsageData);
      console.log(`Successfully updated usage for tenantId: ${tenantId}`);
  } catch (error) {
      console.error(`Error updating usage for tenantId: ${tenantId}. Error: ${error.message}`);
      throw error;
  }
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  getUsageByTenantId,
  updateUsageByTenantId,
};
