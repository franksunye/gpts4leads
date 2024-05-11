const knex = require('../database');

const create = (billingData) => {
  return knex('billings').insert(billingData);
};

const findAll = () => {
  return knex('billings').select('*');
};

const findById = (id) => {
  return knex('billings').select('*').where('billing_id', id).first();
};

const update = (id, billingData) => {
  return knex('billings').where('billing_id', id).update(billingData);
};

const remove = (id) => {
  return knex('billings').where('billing_id', id).del();
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};