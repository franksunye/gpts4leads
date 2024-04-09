const FormDataModel = require('../../shared/models/formDataModel');
const formDataService = require('../../shared/services/formDataService');
const formService = require('../../shared/services/formService');

const csvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

exports.createFormData = async (ctx) => {
  try {
    const newEntry = ctx.request.body;
    const id = await FormDataModel.create(newEntry);
    ctx.status = 201;
    ctx.body = { EntryID: id, ...newEntry };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getAllFormData = async (ctx) => {
  try {
    const data = await FormDataModel.findAll();
    ctx.body = data;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getFormDataById = async (ctx) => {
  try {
    const { id } = ctx.params;
    const entry = await FormDataModel.findById(id);
    if (entry) {
      ctx.body = entry;
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Entry not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.updateFormData = async (ctx) => {
  try {
    const { id } = ctx.params;
    const updated = await FormDataModel.update(id, ctx.request.body);
    if (updated) {
      ctx.body = { EntryID: id, ...ctx.request.body };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Entry not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.deleteFormData = async (ctx) => {
  try {
    const { id } = ctx.params;
    const deleted = await FormDataModel.softDelete(id);
    if (deleted) {
      ctx.status = 200;
      ctx.body = { message: 'Entry deleted' };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Entry not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.downloadFormData = async (ctx) => {
  const formUuid = ctx.params.uuid;
  const formId = await formService.getFormIdByUuid(formUuid);
  const formData = await formDataService.getFormDataById(formId)

  const csvPath = `./downloads/form-${formUuid}.csv`;

  const writer = csvWriter({
      path: csvPath,
      header: [
          {id: 'UUID', title: 'UUID'},
          {id: 'CreatedAt', title: 'Created At'},
          {id: 'Customer Name', title: 'Customer Name'},
      ]
  });

  await writer.writeRecords(formData);

  ctx.set('Content-disposition', `attachment; filename=form-${formUuid}.csv`);
  ctx.set('Content-type', 'text/csv');

  ctx.body = fs.createReadStream(csvPath);
};