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

const findByUsername = (username) => {
  return knex('Users').select('*').where('Username', username).first();
};

const findByEmail = (email) => {
  return knex('Users').select('*').where('Email', email).first();
};

const update = (id, userData) => {
  return knex('Users').where('UserID', id).update({...userData, UpdatedAt: knex.fn.now()});
};

const remove = (id) => {
  return knex('Users').where('UserID', id).del();
};

module.exports = {
  create,
  findAll,
  findById,
  findByUsername,
  findByEmail,
  update,
  remove
};
