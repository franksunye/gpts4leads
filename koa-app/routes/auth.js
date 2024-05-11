const Router = require('koa-router');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = new Router();

// 假设你有一个getUserByUsername的函数来从数据库中获取用户信息
const { getUserByUsername } = require('../../shared/services/userService');

const querystring = require('querystring');

router.post('/login', async (ctx, next) => {
 // 检查请求类型并手动解析请求体
 if (ctx.is('application/x-www-form-urlencoded')) {
    ctx.request.body = querystring.parse(ctx.request.rawBody);
 }

 console.log(ctx.request.body); // 现在应该能正确打印请求体了

 // 确保请求体已被解析，并且包含username和password字段
 if (!ctx.request.body || !ctx.request.body.username || !ctx.request.body.password) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid request body' };
    return;
 }

 const { username, password } = ctx.request.body;
 const user = await getUserByUsername(username);

 if (!user) {
    ctx.status = 401;
    ctx.body = { error: 'User not found' };
    return;
 }
  
 console.log(user); // 添加这行来查看 user 对象的内容

 const match = await bcrypt.compare(password, user.Password);

 if (match) {
    // 如果使用session
    ctx.session.user = { id: user.UserID, username: user.Username, tenantId: user.tenant_id }; // 确保包含租户ID

    // 如果使用JWT
    const token = jwt.sign({ id: user.UserID, username: user.Username }, 'yourSecretKey', { expiresIn: '1h' });
    ctx.body = { message: 'Login successful', token };
    // 重定向到管理员后台首页
    const tenantId = ctx.session.user.tenantId;
    ctx.redirect(`/home/${tenantId}`);

 } else {
    ctx.status = 401;
    ctx.body = { error: 'Invalid password' };
 }
});

module.exports = router;