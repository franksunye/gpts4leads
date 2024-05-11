// shared/models/formDataModel.js
const knex = require("../database");
const { generateLowercaseAlphanumericUUID } = require("../utils/uuid");
const FormModel = require("../models/formModel");

const create = (formData) => {
  const uuid = generateLowercaseAlphanumericUUID();
  const formDataWithUUID = { ...formData, uuid: uuid };
  return knex("form_data").insert(formDataWithUUID);
};

const findAll = () => {
  return knex("form_data").select("*").where("is_deleted", false);
};

const findById = (id) => {
  return knex("form_data")
   .select("*")
   .where("entry_id", id)
   .andWhere("is_deleted", false)
   .first();
};

const update = (id, formData) => {
  return knex("form_data")
   .where("entry_id", id)
   .update({...formData, updated_at: knex.fn.now()});
};

const remove = (id) => {
  return knex("form_data").where("entry_id", id).del();
};

const softDelete = (id) => {
  return knex("form_data")
   .where("entry_id", id)
   .update({ is_deleted: true, updated_at: knex.fn.now() });
};

const softDeleteByFormId = async (formId) => {
  return knex("form_data")
   .where("form_id", formId)
   .update({ is_deleted: true, updated_at: knex.fn.now() });
};

const getFormDataById = (formId) => {
  return knex("form_data")
   .where("form_id", formId)
   .andWhere("is_deleted", false)
   .select("*");
};

const getFormDataByIdWithPagination = (formId, offset = 0, limit = 10, sortOrder = 'desc') => {
  return knex("form_data")
   .where("form_id", formId)
   .andWhere("is_deleted", false)
   .offset(offset)
   .limit(limit)
   .orderBy("created_at", sortOrder)
   .select("*");
};

const getFormDataByUuidWithPagination = (uuid, offset = 0, limit = 10) => {
  return knex("form_data")
   .where("uuid", uuid)
   .andWhere("is_deleted", false)
   .offset(offset)
   .limit(limit)
   .select("*");
};

const countFormDataByFormId = (formId) => {
  return knex("form_data")
   .where("form_id", formId)
   .andWhere("is_deleted", false)
   .count("* as count");
};

const countFormDataByTenantId = async (tenantId) => {
  try {
    const result = await knex("form_data")
      .count("* as count")
      .whereIn("form_id", function () {
        this.select("form_id").from("forms").where("tenant_id", tenantId);
      })
      .andWhere("is_deleted", false);

    return result[0].count;
  } catch (error) {
    console.error(
      `Error counting form data for tenantId: ${tenantId}. Error: ${error.message}`
    );
    throw error;
  }
};

const getFormDataCountByDateRange = async (tenantId, startDate, endDate) => {
  try {
    let query;
    // 使用通用的日期函数和表名
    query = `
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM form_data
      WHERE form_id IN (
          SELECT form_id FROM forms WHERE tenant_id =?
      )
      AND created_at BETWEEN? AND?
      AND is_deleted = false
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    const result = await knex.raw(query, [tenantId, startDate, endDate]);
    return result;
  } catch (error) {
    console.error(`Error executing query. Error: ${error.message}`);
    throw error;
  }
};

const getFormDataCountByDateRangeAndUniqueField = async (tenantId, uniqueField, startDate, endDate) => {
  try {
    let query;
    if (knex.client.config.client === 'sqlite3') {
      // SQLite 使用 json_extract 函数
      query = `
        SELECT DATE(created_at) as date, COUNT(DISTINCT json_extract(data, '$.${uniqueField}')) as count
        FROM form_data
        WHERE form_id IN (
            SELECT form_id FROM forms WHERE tenant_id =?
        )
        AND created_at BETWEEN? AND?
        AND is_deleted = false
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;
    } else if (knex.client.config.client === 'postgres') {
      // PostgreSQL 直接在 JSON 数据上使用操作符
      query = `
        SELECT DATE("created_at") as date, COUNT(DISTINCT "data"->>'${uniqueField}') as count
        FROM "form_data"
        WHERE "form_id" IN (
            SELECT "form_id" FROM "forms" WHERE "tenant_id" =?
        )
        AND "created_at" BETWEEN? AND?
        AND "is_deleted" = false
        GROUP BY DATE("created_at")
        ORDER BY date ASC
      `;
    } else {
      throw new Error('Unsupported database client');
    }

    const result = await knex.raw(query, [tenantId, startDate, endDate]);
    return result;
  } catch (error) {
    console.error(`Error executing query. Error: ${error.message}`);
    throw error;
  }
};

const getAllDataFieldsByTenantId = async (tenantId) => {
  try {
    const forms = await FormModel.findByTenantId(tenantId);

    let allDataFields = [];

    for (const form of forms) {
      const formData = await knex("form_data")
    .where("form_id", form.form_id)
    .andWhere("is_deleted", false)
    .select('*'); // 选择所有列
      // 检查 formData 是否存在
      if (formData.length > 0) {
        allDataFields.push(...formData.map(record => record.data));
      } else {
        console.info(`No formData found for formId: ${form.form_id}`);
      }
    }
    return allDataFields;
  } catch (error) {
    console.error(`Error getting all data fields for tenantId: ${tenantId}. Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  getFormDataById,
  getFormDataByIdWithPagination,
  getFormDataByUuidWithPagination,
  countFormDataByFormId,
  softDelete,
  softDeleteByFormId,
  countFormDataByTenantId,
  getFormDataCountByDateRange,
  getFormDataCountByDateRangeAndUniqueField,
  getAllDataFieldsByTenantId,
};
