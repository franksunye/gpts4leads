const knex = require('../database');
const { generateTenDigitNumericUUID } = require('../utils/uuid');

const create = (formData) => {
  const uuid = generateTenDigitNumericUUID();
  const formDataWithUUID = { ...formData, uuid: uuid };
  
  return knex('forms').insert(formDataWithUUID);
};

const findAll = () => {
  return knex('forms').select('*');
};

const findById = (id) => {
  return knex('forms').select('*').where('form_id', id).first();
};

const update = (id, formData) => {
  return knex('forms').where('form_id', id).update({...formData, updated_at: knex.fn.now()});
};

const remove = (id) => {
  return knex('forms').where('form_id', id).del();
};

const findByTenantId = (tenantId) => {
  return knex('forms').where('tenant_id', tenantId).select('*');
};

const findByTenantIdWithPagination = (tenantId, offset = 0, limit = 10) => {
  return knex('forms')
    .where('tenant_id', tenantId)
    .andWhere('is_deleted', false)
    .select('*')
    .offset(offset)
    .limit(limit);
};

const countFormsByTenantId = (tenantId) => {
  return knex('forms')
    .where('tenant_id', tenantId)
    .andWhere('is_deleted', false)
    .count('* as count');
};

const findByUuid = async (formUuid) => {
  return knex('forms')
    .where('uuid', formUuid)
    .first();
};

const deleteMany = async (conditions) => {
  return knex('forms')
    .where(conditions)
    .del();
};

const softDelete = async (formId) => {
  return knex('forms')
    .where('form_id', formId)
    .update({ is_deleted: true, updated_at: knex.fn.now() });
};

const softDeleteMany = async (conditions) => {
  return knex('forms')
    .where(conditions)
    .update({ is_deleted: true, updated_at: knex.fn.now() });
};

// Fetch forms and count associated form data, excluding deleted form data
const fetchFormsWithDataCount = async (tenantId, offset, limit) => {
  const query = knex('forms as f')
    .leftJoin(
      knex('form_data')
        .select('form_id')
        .count('entry_id as form_data_count')
        .groupBy('form_id')
        .as('sub'),
      'f.form_id', 'sub.form_id'
    )
    .where('f.tenant_id', tenantId)
    .andWhere('f.is_deleted', false)
    .select('f.*', knex.raw('COALESCE(sub.form_data_count, 0) as form_data_count'))
    .orderBy('f.created_at', 'desc')
    .offset(offset)
    .limit(limit);

  // 打印SQL语句和参数
  console.log(query.toString());

  // 执行查询
  return query;
};


const findUUIDByFormId = async (formId) => {
  return knex('forms')
    .select('uuid')
    .where('form_id', formId)
    .first();
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
  findUUIDByFormId,
};