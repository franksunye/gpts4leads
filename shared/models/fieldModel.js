const knex = require('../database');

const create = (fieldData) => {
  return knex('Fields').insert(fieldData);
};

const findAll = () => {
  return knex('Fields').select('*');
};

const findById = (id) => {
  return knex('Fields').select('*').where('FieldID', id).first();
};

const update = (id, fieldData) => {
  return knex('Fields').where('FieldID', id).update({...fieldData, UpdatedAt: knex.fn.now()});
};

const remove = (id) => {
  return knex('Fields').where('FieldID', id).del();
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};
