const knex = require('../database');

const create = (userData) => {
  return knex('Users').insert(userData);
};

const findAll = () => {
  return knex('Users').select('*');
};

const findById = (id) => {
  return knex('Users').select('*').where('UserID', id).first();
};

const update = (id, userData) => {
  return knex('Users').where('UserID', id).update(userData);
};

const remove = (id) => {
  return knex('Users').where('UserID', id).del();
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};
