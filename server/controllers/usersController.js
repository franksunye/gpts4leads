const UserModel = require('../models/userModel');

exports.createUser = async (ctx) => {
  try {
    const newUser = ctx.request.body;
    const id = await UserModel.create(newUser);
    ctx.status = 201;
    ctx.body = { id, ...newUser };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getAllUsers = async (ctx) => {
  try {
    const users = await UserModel.findAll();
    ctx.body = users;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.getUserById = async (ctx) => {
  try {
    const { id } = ctx.params;
    const user = await UserModel.findById(id);
    if (user) {
      ctx.body = user;
    } else {
      ctx.status = 404;
      ctx.body = { message: 'User not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.updateUser = async (ctx) => {
  try {
    const { id } = ctx.params;
    const updated = await UserModel.update(id, ctx.request.body);
    if (updated) {
      ctx.body = { id, ...ctx.request.body };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'User not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};

exports.deleteUser = async (ctx) => {
  try {
    const { id } = ctx.params;
    const deleted = await UserModel.remove(id);
    if (deleted) {
      ctx.status = 200;
      ctx.body = { message: 'User deleted' };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'User not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: error.message };
  }
};
