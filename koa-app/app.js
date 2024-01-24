const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const jwt = require('koa-jwt');

const tenantsRoutes = require('./routes/tenantsRoutes');
const formsRoutes = require('./routes/formsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const fieldsRoutes = require('./routes/fieldsRoutes');
const formDataRoutes = require('./routes/formDataRoutes');
const plansRoutes = require('./routes/plansRoutes');
const tenantPlansRoutes = require('./routes/tenantPlansRoutes');
const billingsRoutes = require('./routes/billingsRoutes');
const usageTrackingRoutes = require('./routes/usageTrackingRoutes');

const app = new Koa();
const secret = 'your-secret'; // 这应该是一个环境变量

app.use(bodyParser());

// JWT认证中间件
// app.use(jwt({ secret }).unless({
//   path: [/^\/public/, /^\/login/] // 定义不需要身份验证的路径
// }));

app.use(tenantsRoutes.routes());
app.use(formsRoutes.routes());
app.use(usersRoutes.routes());
app.use(fieldsRoutes.routes());
app.use(formDataRoutes.routes());
app.use(plansRoutes.routes());
app.use(tenantPlansRoutes.routes());
app.use(billingsRoutes.routes());
app.use(usageTrackingRoutes.routes());

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
