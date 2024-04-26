const knex = require('../database');

const create = (usageData) => {
  return knex('UsageTracking').insert(usageData);
};

const findAll = () => {
  return knex('UsageTracking').select('*');
};

const findById = (id) => {
  return knex('UsageTracking').select('*').where('UsageID', id).first();
};

const update = (id, usageData) => {
  usageData.Date = knex.raw('CURRENT_TIMESTAMP');
  return knex('UsageTracking').where('UsageID', id).update(usageData);
};

const remove = (id) => {
  return knex('UsageTracking').where('UsageID', id).del();
};

const getUsageByTenantId = (tenantId) => {
  return knex('UsageTracking').select('*').where('TenantID', tenantId).first();
};

const updateUsageByTenantId = async (tenantId, newUsageData) => {
  try {
      // 更新数据库中对应租户的使用情况记录
      await knex('UsageTracking')
          .where('TenantID', tenantId)
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
