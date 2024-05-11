const knex = require('../database');
const { generateSixDigitNumericUUID } = require('../utils/uuid'); 

// const create = (userData) => {
//   return knex('Users').insert(userData);
// };

const create = async (userData) => {
  // let result = await knex('Users').insert(userData);

  const uuid = generateSixDigitNumericUUID();
  const userDataWithUUID = { ...userData, uuid: uuid };

  let result = await knex('users').insert(userDataWithUUID);

  // 在 SQLite 中，将结果转换为对象
  if (process.env.DB_CLIENT === 'sqlite3') {
     result = { user_id: result[0] };
  }
 
  // 在 PostgreSQL 中，查询新插入的行
  if (process.env.DB_CLIENT === 'postgres') {
    result = await knex('users').where('email', userData.email).first();
  }
 
  return result;
 };
 
const findAll = () => {
  return knex('users').select('*');
};

const findById = (id) => {
  return knex('users').select('*').where('user_id', id).first();
};

const findByUsername = (username) => {
  return knex('users').select('*').where('username', username).first();
};

const findByEmail = (email) => {
  return knex('users').select('*').where('email', email).first();
};

const update = (id, userData) => {
  return knex('users').where('user_id', id).update({...userData, updated_at: knex.fn.now()});
};

const remove = (id) => {
  return knex('users').where('user_id', id).del();
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
