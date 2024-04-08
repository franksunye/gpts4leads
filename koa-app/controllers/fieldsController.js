const FieldModel = require('../../shared/models/fieldModel');

exports.createField = async (ctx) => {
  try {
    const newField = ctx.request.body;
    const id = await FieldModel.create(newField);
    ctx.status = 201;
    ctx.body = { id, ...newField };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getAllFields = async (ctx) => {
  try {
    const fields = await FieldModel.findAll();
    ctx.body = fields;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getFieldById = async (ctx) => {
  try {
    const { id } = ctx.params;
    const field = await FieldModel.findById(id);
    if (field) {
      ctx.body = field;
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Field not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.updateField = async (ctx) => {
  try {
    const { id } = ctx.params;
    const updated = await FieldModel.update(id, ctx.request.body);
    if (updated) {
      ctx.body = { id, ...ctx.request.body };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Field not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.deleteField = async (ctx) => {
  try {
    const { id } = ctx.params;
    const deleted = await FieldModel.remove(id);
    if (deleted) {
      ctx.status = 200;
      ctx.body = { message: 'Field deleted' };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Field not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getFieldsByFormId = async (ctx) => {
  try {
     const { formId } = ctx.params;
     const fields = await FieldModel.findByFormId(formId);
     ctx.body = fields;
  } catch (error) {
     ctx.status = 500;
     ctx.body = { message: error.message };
  }
 };