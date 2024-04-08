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
     .andWhere('IsDeleted', false)
     .select('*')
     .offset(offset)
     .limit(limit);
 };

const countFormsByTenantId = (tenantId) => {
  return knex('Forms')
     .where('TenantID', tenantId)
     .andWhere('IsDeleted', false)
     .count('* as count');
};

const findByUuid = async (formUuid) => {
  return knex('Forms')
     .where('uuid', formUuid)
     .first();
 };

const deleteMany = async (conditions) => {
  return knex('Forms')
     .where(conditions)
     .del();
 };

 const softDelete = async (formId) => {
  return knex('Forms')
     .where('FormID', formId)
     .update({ IsDeleted: true, UpdatedAt: knex.fn.now() });
    };

 const softDeleteMany = async (conditions) => {
  return knex('Forms')
     .where(conditions)
     .update({ IsDeleted: true, UpdatedAt: knex.fn.now() });
    };

// Fetch forms and count associated form data, excluding deleted form data
const fetchFormsWithDataCount = async (tenantId, offset, limit) => {
  return knex('Forms as f')
     .leftJoin('FormData as fd', function() {
       this.on('f.FormID', 'fd.FormID')
          .andOn('fd.IsDeleted', '=', 0); // Exclude deleted form data
     })
     .where('f.TenantID', tenantId)
     .andWhere('f.IsDeleted', false)
     .select('f.*', knex.raw('COUNT(fd.EntryID) as formDataCount'))
     .groupBy('f.FormID')
     .offset(offset)
     .limit(limit);
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
  deleteMany,
  softDelete,
  softDeleteMany,
  fetchFormsWithDataCount,
};