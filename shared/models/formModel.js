const knex = require('../database');

const create = (formData) => {
  return knex('Forms').insert(formData);
};

const findAll = () => {
  return knex('Forms').select('*');
};

const findById = (id) => {
  return knex('Forms').select('*').where('FormID', id).first();
};

const update = (id, formData) => {
  return knex('Forms').where('FormID', id).update({...formData, UpdatedAt: knex.fn.now()});
};

const remove = (id) => {
  return knex('Forms').where('FormID', id).del();
};

const findByTenantId = (tenantId) => {
  return knex('Forms').where('TenantID', tenantId).select('*');
};

const findByTenantIdWithPagination = (tenantId, offset = 0, limit = 10) => {
  return knex('Forms')
     .where('TenantID', tenantId)
     .select('*')
     .offset(offset)
     .limit(limit);
 };

const countFormsByTenantId = (tenantId) => {
  return knex('Forms')
     .where('TenantID', tenantId)
     .count('* as count');
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  findByTenantId,
  findByTenantIdWithPagination,
  countFormsByTenantId,
};