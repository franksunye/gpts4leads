require("dotenv").config();
const logger = require("./utils/logger");

logger.info(`[database.js] DB_CLIENT: ${process.env.DB_CLIENT}`);

const knex = require("knex")({
  client: process.env.DB_CLIENT || "sqlite3",
  connection:
    process.env.DB_CLIENT === "postgres"
      ? {
          host: process.env.POSTGRES_HOST,
          user: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DATABASE,
          ssl: {
            rejectUnauthorized: false, // 如果你的证书不是由受信任的证书颁发机构签发的，你可能需要设置这个为 false
          },          
        }
      : process.env.DB_CLIENT === "mysql"
      ? {
          host: process.env.MYSQL_HOST,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
        }
      : {
          filename: process.env.DB_FILENAME || "./gpts4leads-saas-app.db",
        },
  useNullAsDefault: true,
  debug: true, // 开启调试模式
});

module.exports = knex;
