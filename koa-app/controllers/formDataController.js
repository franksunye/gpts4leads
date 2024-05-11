const FormDataModel = require('../../shared/models/formDataModel');
const formDataService = require('../../shared/services/formDataService');
const formService = require('../../shared/services/formService');
const fieldService = require('../../shared/services/fieldService');

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

exports.createFormDataByUuid = async (ctx) => {
  const { uuid } = ctx.params;
  const formId = await formService.getFormIdByUuid(uuid);
  if (!formId) {
     ctx.throw(404, 'Form not found');
  }
 
  const newEntry = {
     ...ctx.request.body,
     FormID: formId
  };
 
  try {
     const id = await FormDataModel.create(newEntry);
     ctx.status = 201;
     ctx.body = { EntryID: id, ...newEntry };
  } catch (error) {
     ctx.status = 500;
     ctx.body = { message: error.message };
  }
 };

 exports.createFormDataByUuidWithData = async (ctx) => {

  const { uuid } = ctx.params;
  const formId = await formService.getFormIdByUuid(uuid);
  if (!formId) {
     ctx.throw(404, 'Form not found');
  }
  
  const data = ctx.request.body;
 
  const newEntry = {
    FormID: formId,
    Data: data
  };

  try {
     const id = await FormDataModel.create(newEntry);
     ctx.status = 201;
     ctx.body = { EntryID: id, ...newEntry };
  } catch (error) {
     ctx.status = 500;
     ctx.body = { message: error.message };
  }
 };

 exports.getFormOas = async (ctx) => {
  const { uuid } = ctx.params;
  const formId = await formService.getFormIdByUuid(uuid);

  const formFields = await fieldService.getFieldsByFormId(formId)
 
  let requiredFields = [];
  let properties = {};
  formFields.forEach(field => {
   requiredFields.push(field.name); 
   properties[field.name] = { 
      type: field.type, 
      description: field.description,
      format: field.format,
   };
  });

  let requiredFieldsString = requiredFields.map(field => `          - "${field}"`).join('\n');

  let propertiesString = '';
  for (const [key, value] of Object.entries(properties)) {
   propertiesString += '        "' + key + '":\n'; // 添加8个空格
   propertiesString += '          type: ' + value.type + '\n'; // 添加10个空格
   if (value.description) {
      propertiesString += '          description: ' + value.description + '\n'; // 添加10个空格
   }
   if (value.format) {
      propertiesString += '          format: ' + value.format + '\n'; // 添加10个空格
   }
  //  propertiesString += '\n';
  }

 const apiUrl = process.env.API_URL;

  const oasTemplate = `
openapi: "3.0.1"
info:
 title: "Form Data API"
 version: "v1"
servers:
 - url: "${apiUrl}"
paths:
 "/formData/uuid/${uuid}/data":
    post:
      operationId: "createFormDataByUuidWithData"
      summary: "Create form data with a specific UUID and additional data."
      parameters:
        - name: "uuid"
          in: "path"
          required: true
          schema:
            type: "string"
            format: "uuid"
      requestBody:
        required: true
        content:
          "application/json":
            schema:
              "$ref": "#/components/schemas/FormDataRequestBody"
      responses:
        "201":
          description: "Form data created successfully."
          content:
            "application/json":
              schema:
                "$ref": "#/components/schemas/FormDataResponse"
        "404":
          description: "Form not found."
        "500":
          description: "Server error."
components:
 schemas:
    FormDataRequestBody:
      type: "object"
      required:
${requiredFieldsString}
      properties:
${propertiesString}
    FormDataResponse:
      type: "object"
      properties:
        EntryID:
          type: "integer"
          format: "int64"
        data:
          type: "object"
          description: "The form data created."
`;
 
  ctx.type = 'text/yaml'; 
  ctx.body = oasTemplate;
 };

 exports.getAllDataFieldsByTenantId = async (ctx) => {
  try {
    const tenantId = ctx.params.tenantId;
    const dataFields = await FormDataModel.getAllDataFieldsByTenantId(tenantId);
    ctx.status = 200;
    ctx.body = dataFields;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};