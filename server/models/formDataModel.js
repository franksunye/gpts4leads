const knex = require('../database');

const create = (formData) => {
  return knex('FormData').insert(formData);
};

const findAll = () => {
  return knex('FormData').select('*');
};

const findById = (id) => {
  return knex('FormData').select('*').where('EntryID', id).first();
};

const update = (id, formData) => {
  return knex('FormData').where('EntryID', id).update(formData);
};

const remove = (id) => {
  return knex('FormData').where('EntryID', id).del();
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};
