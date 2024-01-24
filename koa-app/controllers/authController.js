// /server/controllers/authController.js
const jwt = require('jsonwebtoken');
const UserModel = require('../../shared/models/userModel');
const secret = 'your-secret'; // 应该放在环境变量中

exports.login = async (ctx) => {
  const { username, password } = ctx.request.body;
  const user = await UserModel.findByUsername(username);

  if (user && user.password === password) { // 这里应该使用加密密码
    const token = jwt.sign({ id: user.UserID }, secret, { expiresIn: '1h' });
    ctx.body = { token };
  } else {
    ctx.status = 401;
    ctx.body = { message: 'Authentication failed' };
  }
};
