// shared/models/formDataModel.js
const knex = require("../database");
const { generateLowercaseAlphanumericUUID } = require("../utils/uuid");

const create = (formData) => {
  const uuid = generateLowercaseAlphanumericUUID();
  const formDataWithUUID = { ...formData, UUID: uuid };
  return knex("FormData").insert(formDataWithUUID);
};

const findAll = () => {
  return knex("FormData").select("*").where("IsDeleted", false);
};

const findById = (id) => {
  return knex("FormData")
    .select("*")
    .where("EntryID", id)
    .andWhere("IsDeleted", false)
    .first();
};

const update = (id, formData) => {
  return knex("FormData")
    .where("EntryID", id)
    .update({ ...formData, UpdatedAt: knex.fn.now() });
};

const remove = (id) => {
  return knex("FormData").where("EntryID", id).del();
};

const softDelete = (id) => {
  return knex("FormData")
    .where("UUID", id)
    .update({ IsDeleted: true, UpdatedAt: knex.fn.now() });
};

// Soft delete form data by form ID
const softDeleteByFormId = async (formId) => {
  return knex("FormData")
    .where("FormID", formId)
    .update({ IsDeleted: true, UpdatedAt: knex.fn.now() });
};

const getFormDataById = (formId) => {
  return knex("FormData")
    .where("FormID", formId)
    .andWhere("IsDeleted", false)
    .select("*");
};

const getFormDataByIdWithPagination = (formId, offset = 0, limit = 10) => {
  return knex("FormData")
    .where("FormID", formId)
    .andWhere("IsDeleted", false)
    .offset(offset)
    .limit(limit)
    .select("*");
};

const getFormDataByUuidWithPagination = (uuid, offset = 0, limit = 10) => {
  return knex("FormData")
    .where("UUID", uuid)
    .andWhere("IsDeleted", false)
    .offset(offset)
    .limit(limit)
    .select("*");
};

const countFormDataByFormId = (formId) => {
  return knex("FormData")
    .where("FormID", formId)
    .andWhere("IsDeleted", false)
    .count("* as count");
};

const countFormDataByTenantId = async (tenantId) => {
  try {
    const result = await knex("FormData")
      .count("* as count")
      .whereIn("FormID", function () {
        this.select("FormID").from("Forms").where("TenantID", tenantId);
      })
      .andWhere("IsDeleted", false);

    return result[0].count;
  } catch (error) {
    console.error(
      `Error counting form data for tenantId: ${tenantId}. Error: ${error.message}`
    );
    throw error;
  }
};

const countUniqueFieldByTenantId = async (tenantId, fieldName) => {
  try {
    // 使用SQLite支持的json_extract函数
    const query = `
    SELECT COUNT(DISTINCT json_extract(Data, '$.${fieldName}')) as uniqueFieldCount
    FROM FormData
    WHERE FormID IN (
        SELECT FormID FROM Forms WHERE TenantID = ?
    )
    AND IsDeleted = false
`;
    // 使用 knex.raw 并正确地传递参数
    const result = await knex.raw(query, [tenantId]);
    return result[0].uniqueFieldCount;
  } catch (error) {
    console.error(
      `Error counting unique ${fieldName} for tenantId: ${tenantId}. Error: ${error.message}`
    );
    throw error;
  }
};

const getFormDataCountByDateRange = async (tenantId, startDate, endDate) => {
  try {
      const query = `
          SELECT DATE(CreatedAt) as date, COUNT(*) as count
          FROM FormData
          WHERE FormID IN (
              SELECT FormID FROM Forms WHERE TenantID = ?
          )
          AND CreatedAt BETWEEN ? AND ?
          AND IsDeleted = false
          GROUP BY DATE(CreatedAt)
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
      const query = `
          SELECT DATE(CreatedAt) as date, COUNT(DISTINCT json_extract(Data, '$.${uniqueField}')) as count
          FROM FormData
          WHERE FormID IN (
              SELECT FormID FROM Forms WHERE TenantID = ?
          )
          AND CreatedAt BETWEEN ? AND ?
          AND IsDeleted = false
          GROUP BY DATE(CreatedAt)
          ORDER BY date ASC
      `;
      const result = await knex.raw(query, [tenantId, startDate, endDate]);
      return result;
  } catch (error) {
      console.error(`Error executing query. Error: ${error.message}`);
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
  countUniqueFieldByTenantId,
  getFormDataCountByDateRange,
  getFormDataCountByDateRangeAndUniqueField,
};
