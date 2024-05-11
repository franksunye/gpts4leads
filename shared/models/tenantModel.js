const knex = require('../database');
const { generateSixDigitNumericUUID } = require('../utils/uuid');
// const create = (tenantData) => {
//   return knex('Tenants').insert(tenantData);
// };
const create = async (tenantData) => {
  // let result = await knex('Tenants').insert(tenantData);
  const uuid = generateSixDigitNumericUUID();
  const tenantDataWithUUID = { ...tenantData, uuid: uuid };
  let result = await knex('tenants').insert(tenantDataWithUUID);

  if (process.env.DB_CLIENT === 'sqlite3') {
    result = { tenant_id: result[0] };
  }
 
  if (process.env.DB_CLIENT === 'postgres') {
    result = await knex('tenants').where('name', tenantData.name).first();
  }
 
  return result;
 };

const findAll = () => {
  return knex('tenants').select('*');
};

const findById = (id) => {
  return knex('tenants').select('*').where('tenant_id', id).first();
};

// const findById = async (id) => {
//   return await knex('"Tenants"').where('"TenantID"', id).first();
//  };

const update = (id, tenantData) => {
  return knex('tenants')
   .where('tenant_id', id)
   .update({...tenantData, updated_at: knex.fn.now() });
};

const remove = (id) => {
  return knex('tenants').where('tenant_id', id).del();
};

const findByUuid = async (tenantUuid) => {
  return knex('tenants').select('*').where('uuid', tenantUuid).first();
 };

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  findByUuid
};
