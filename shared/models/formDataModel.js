// shared/models/formDataModel.js
const knex = require('../database');
const { generateLowercaseAlphanumericUUID } = require('../utils/uuid');

const create = (formData) => {
  const uuid = generateLowercaseAlphanumericUUID();
  const formDataWithUUID = { ...formData, UUID: uuid };
  return knex('FormData').insert(formDataWithUUID);
};

const findAll = () => {
  return knex('FormData').select('*').where('IsDeleted', false);
};

const findById = (id) => {
  return knex('FormData').select('*').where('EntryID', id).andWhere('IsDeleted', false).first();
};

const update = (id, formData) => {
  return knex('FormData').where('EntryID', id).update({...formData, UpdatedAt: knex.fn.now()});
};

const remove = (id) => {
  return knex('FormData').where('EntryID', id).del();
};

const softDelete = (id) => {
  return knex('FormData').where('UUID', id).update({ IsDeleted: true, UpdatedAt: knex.fn.now() });
 };

const getFormDataById = (formId) => {
  return knex('FormData')
      .where('FormID', formId)
      .andWhere('IsDeleted', false)
      .select('*');
};

const getFormDataByIdWithPagination = (formId, offset = 0, limit = 10) => {
  return knex('FormData')
      .where('FormID', formId)
      .andWhere('IsDeleted', false)
      .offset(offset)
      .limit(limit)
      .select('*');
};

const getFormDataByUuidWithPagination = (uuid, offset = 0, limit = 10) => {
  return knex('FormData')
     .where('UUID', uuid)
     .andWhere('IsDeleted', false)
     .offset(offset)
     .limit(limit)
     .select('*');
 };

const countFormDataByFormId = (formId) => {
  return knex('FormData')
      .where('FormID', formId)
      .andWhere('IsDeleted', false)
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
  getFormDataByUuidWithPagination,
  countFormDataByFormId,
  softDelete
};
