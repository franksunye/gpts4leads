const knex = require('../database');

const create = (billingData) => {
  return knex('Billings').insert(billingData);
};

const findAll = () => {
  return knex('Billings').select('*');
};

const findById = (id) => {
  return knex('Billings').select('*').where('BillingID', id).first();
};

const update = (id, billingData) => {
  return knex('Billings').where('BillingID', id).update(billingData);
};

const remove = (id) => {
  return knex('Billings').where('BillingID', id).del();
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};
