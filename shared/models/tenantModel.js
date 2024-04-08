const knex = require('../database');
const { generateSixDigitNumericUUID } = require('../utils/uuid');
// const create = (tenantData) => {
//   return knex('Tenants').insert(tenantData);
// };
const create = async (tenantData) => {
  // let result = await knex('Tenants').insert(tenantData);
  const uuid = generateSixDigitNumericUUID();
  const tenantDataWithUUID = { ...tenantData, UUID: uuid };
  let result = await knex('Tenants').insert(tenantDataWithUUID);

  if (process.env.DB_CLIENT === 'sqlite3') {
     result = { TenantID: result[0] };
  }
 
  if (process.env.DB_CLIENT === 'postgres') {
     result = await knex('Tenants').where('Name', tenantData.Name).first();
  }
 
  return result;
 };

const findAll = () => {
  return knex('Tenants').select('*');
};

const findById = (id) => {
  return knex('Tenants').select('*').where('TenantID', id).first();
};

// const findById = async (id) => {
//   return await knex('"Tenants"').where('"TenantID"', id).first();
//  };

const update = (id, tenantData) => {
  return knex('Tenants')
    .where('TenantID', id)
    .update({ ...tenantData, UpdatedAt: knex.fn.now() });
};

const remove = (id) => {
  return knex('Tenants').where('TenantID', id).del();
};

const findByUuid = async (tenantUuid) => {
  return knex('Tenants').select('*').where('UUID', tenantUuid).first();
 };

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  findByUuid
};
