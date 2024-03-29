const knex = require('../database');
const { generateTenDigitNumericUUID } = require('../utils/uuid');

const create = (formData) => {
  const uuid = generateTenDigitNumericUUID();
  const formDataWithUUID = { ...formData, UUID: uuid };
  
  return knex('Forms').insert(formDataWithUUID);
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

const findByUuid = async (formUuid) => {
  try {
     const result = await knex('Forms') 
       .where('uuid', formUuid)
       .first();
     return result ? result.FormID : null;
  } catch (error) {
     console.error(`[formModel.js] findByUuid: Error fetching formId for formUuid: ${formUuid}. Error: ${error.message}`);
     throw error;
  }
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
  findByUuid,
};