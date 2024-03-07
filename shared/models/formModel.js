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

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  findByTenantId //  添加新的方法到模块导出
};