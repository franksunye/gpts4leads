const knex = require('../database');

const create = (tenantData) => {
  return knex('Tenants').insert(tenantData);
};

const findAll = () => {
  return knex('Tenants').select('*');
};

const findById = (id) => {
  return knex('Tenants').select('*').where('TenantID', id).first();
};

const update = (id, tenantData) => {
  return knex('Tenants')
    .where('TenantID', id)
    .update({ ...tenantData, UpdatedAt: knex.fn.now() });
};

const remove = (id) => {
  return knex('Tenants').where('TenantID', id).del();
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};
