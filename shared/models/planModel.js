const knex = require('../database');

const create = (planData) => {
  return knex('Plans').insert(planData);
};

const findAll = () => {
  return knex('Plans').select('*');
};

const findById = (id) => {
  return knex('Plans').select('*').where('PlanID', id).first();
};

const update = (id, planData) => {
  return knex('Plans').where('PlanID', id).update({ ...planData, UpdatedAt: knex.fn.now() });
};

const remove = (id) => {
  return knex('Plans').where('PlanID', id).del();
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};
