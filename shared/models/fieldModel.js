const knex = require('../database');
const { generateTwelveDigitUUID } = require('../utils/uuid'); 

const create = (fieldData) => {
  const uuid = generateTwelveDigitUUID();
  const fieldDataWithUUID = { ...fieldData, UUID: uuid };

  return knex('Fields').insert(fieldDataWithUUID);
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

const findByFormId = (formId) => {
  return knex('Fields').select('*').where('FormID', formId);
 };

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  findByFormId
};
