const knex = require('../database');
const { generateTwelveDigitUUID } = require('../utils/uuid'); 

const create = (fieldData) => {
  const uuid = generateTwelveDigitUUID();
  const fieldDataWithUUID = { ...fieldData, uuid: uuid };

  return knex('fields').insert(fieldDataWithUUID);
};

const findAll = () => {
  return knex('fields').select('*');
};

const findById = (id) => {
  return knex('fields').select('*').where('field_id', id).first();
};

const update = (id, fieldData) => {
  return knex('fields').where('field_id', id).update({...fieldData, updated_at: knex.fn.now()});
};

const remove = (id) => {
  return knex('fields').where('field_id', id).del();
};

const findByFormId = (formId) => {
  return knex('fields').where('form_id', formId).select('*');
 };

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  findByFormId
};
