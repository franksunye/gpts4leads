const logger = require('../shared/utils/logger'); 

// 处理命令行参数
const args = process.argv.slice(2);
logger.info(`[app.js] Command line arguments: ${args}`);

const dbArg = args.find(arg => arg.startsWith('--db='));
let dbType = 'sqlite3'; // 默认为SQLite

if (dbArg) {
  logger.info(`[app.js] Found --db argument: ${dbArg}`);
  dbType = dbArg.split('=')[1];
} else {
  logger.info(`[app.js] No --db argument found, using default: ${dbType}`);
}

// 设置环境变量
logger.info(`[app.js] Before setting DB_CLIENT: ${process.env.DB_CLIENT}`);
process.env.DB_CLIENT = dbType;
logger.info(`[app.js] After setting DB_CLIENT: ${process.env.DB_CLIENT}`);

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
// const jwt = require('koa-jwt');
const session = require('koa-session');

const views = require('koa-views');
const path = require('path');

const tenantsRoutes = require('./routes/tenantsRoutes');
const formsRoutes = require('./routes/formsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const fieldsRoutes = require('./routes/fieldsRoutes');
const formDataRoutes = require('./routes/formDataRoutes');
const plansRoutes = require('./routes/plansRoutes');
const tenantPlansRoutes = require('./routes/tenantPlansRoutes');
const billingsRoutes = require('./routes/billingsRoutes');
const usageTrackingRoutes = require('./routes/usageTrackingRoutes');

const dashboardRoutes = require('./routes/dashboardRoutes');
// const authRoutes = require('./routes/auth');
const authRoutes = require('./routes/auth0');
// const passwordRoutes = require('./routes/passwordRoutes');
const subscriptionsRoutes = require('./routes/subscriptionsRoutes');

const app = new Koa();

// const secret = 'your-secret'; // 这应该是一个环境变量
app.keys = ['some secret hurr']; // 用于签名cookie的密钥，只有koa-session需要

const CONFIG = {
  key: 'koa:sess', // cookie key (default is koa:sess)
  maxAge: 86400000, // cookie的过期时间 
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
};

app.use(session(CONFIG, app));

// 设置模板引擎
app.use(views(path.join(__dirname, '/views'), {
  extension: 'ejs'
}));

 // 使用koa-bodyparser中间件来解析JSON和表单数据
 app.use(bodyParser({
  enableTypes: ['json', 'form'], 
  raw: true, // 启用raw选项以获取原始请求体
 }));

//  app.use(bodyParser());
 
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

app.use(dashboardRoutes.routes());
app.use(authRoutes.routes());
// app.use(passwordRoutes.routes());
app.use(subscriptionsRoutes.routes());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

