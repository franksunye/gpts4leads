const knex = require('../database');
const { generateSixDigitNumericUUID } = require('../utils/uuid'); 

// const create = (userData) => {
//   return knex('Users').insert(userData);
// };

const create = async (userData) => {
  // let result = await knex('Users').insert(userData);

  const uuid = generateSixDigitNumericUUID();
  const userDataWithUUID = { ...userData, UUID: uuid };

  let result = await knex('Users').insert(userDataWithUUID);

  // 在 SQLite 中，将结果转换为对象
  if (process.env.DB_CLIENT === 'sqlite3') {
     result = { UserID: result[0] };
  }
 
  // 在 PostgreSQL 中，查询新插入的行
  if (process.env.DB_CLIENT === 'postgres') {
     result = await knex('Users').where('Email', userData.Email).first();
  }
 
  return result;
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
