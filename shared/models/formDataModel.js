const knex = require('../database');

const create = (formData) => {
  return knex('FormData').insert(formData);
};

const findAll = () => {
  return knex('FormData').select('*');
};

const findById = (id) => {
  return knex('FormData').select('*').where('EntryID', id).first();
};

const update = (id, formData) => {
  return knex('FormData').where('EntryID', id).update({...formData, UpdatedAt: knex.fn.now()});
};

const remove = (id) => {
  return knex('FormData').where('EntryID', id).del();
};

const getFormDataById = (formId) => {
  return knex('FormData')
      .where('FormID', formId)
      .select('*');
};

const getFormDataByIdWithPagination = (formId, offset = 0, limit = 10) => {
  return knex('FormData')
      .where('FormID', formId)
      .offset(offset)
      .limit(limit)
      .select('*');
};

const countFormDataByFormId = (formId) => {
  return knex('FormData')
      .where('FormID', formId)
      .count('* as count');
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  getFormDataById,
  getFormDataByIdWithPagination,
  countFormDataByFormId,
};
