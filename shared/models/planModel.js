const knex = require('../database');

const create = (planData) => {
  return knex('plans').insert(planData);
};

const findAll = () => {
  return knex('plans').select('*');
};

const findById = (id) => {
  return knex('plans').select('*').where('plan_id', id).first();
};

const update = (id, planData) => {
  return knex('plans').where('plan_id', id).update({...planData, updated_at: knex.fn.now() });
};

const remove = (id) => {
  return knex('plans').where('plan_id', id).del();
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};