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
  return knex('UsageTracking').where('UsageID', id).update(usageData);
};

const remove = (id) => {
  return knex('UsageTracking').where('UsageID', id).del();
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};
