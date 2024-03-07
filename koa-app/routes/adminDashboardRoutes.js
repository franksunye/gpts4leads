// adminDashboardRoutes.js
const Router = require('koa-router');
const formsService = require('../../shared/services/formService');
const logger = require('../../shared/utils/logger');

const router = new Router();

// 权限检查中间件
async function checkAuth(ctx, next) {
  if (!ctx.session.user) { // 假设使用session存储登录状态
    logger.info('[adminDashboardRoutes.js] checkAuth: User not authenticated, redirecting to login');
    ctx.redirect('/login');
  } else {
    await next();
  }
}

//   根目录路由处理函数
router.get('/', async (ctx) => {
  if (ctx.session.user) {
    logger.info(`[adminDashboardRoutes.js] Root route: User is authenticated, redirecting to home`);
    ctx.redirect(`/home/${ctx.session.user.tenantId}`);
  } else {
    logger.info('[adminDashboardRoutes.js] Root route: User not authenticated, redirecting to login');
    ctx.redirect('/login');
  }
});

//   定义路由来渲染首页
router.get('/home/:tenantId', checkAuth, async (ctx) => {
  const tenantId = ctx.params.tenantId;
  try {
     logger.info(`[adminDashboardRoutes.js] Home route: Rendering home page for tenantId: ${tenantId}`);
     await ctx.render('index', {
       title: 'Admin Dashboard',
       user: ctx.session.user || null,
       tenantId: tenantId
     });
  } catch (error) {
     logger.error(`[adminDashboardRoutes.js] Home route: Error rendering home page for tenantId: ${tenantId}. Error: ${error.message}`);
     throw error;
  }
 });


// 定义路由来渲染登录页面
// router.get('/login/:tenantId?', async (ctx) => {
//   const tenantId = ctx.params.tenantId || 'default'; 
//   console.log(`Login request received for tenant ID: ${tenantId}`); 
//   if (ctx.session.user) {
//     console.log(`User is already logged in. Redirecting to tenant page.`); 
//     ctx.redirect(`/home/${tenantId}`);
//     return; 
//   } else {
//     console.log(`User is not logged in. Rendering login page.`); 
//     await ctx.render('login', {
//       title: 'Login',
//       user: ctx.session.user || null,
//       tenantId: tenantId
//     });
//   }
// });


// 添加Forms页面的路由
router.get('/forms/:tenantId', checkAuth, async (ctx) => {
  const tenantId = ctx.params.tenantId;
  try {
     logger.info(`[adminDashboardRoutes.js] Forms route: Fetching forms for tenantId: ${tenantId}`);
     const forms = await formsService.getFormsByTenantId(tenantId);
     logger.info(`[adminDashboardRoutes.js] Forms route: Successfully fetched forms for tenantId: ${tenantId}`);
     await ctx.render('forms', {
         title: 'Forms Dashboard',
         user: ctx.session.user || null,
         forms: forms,
         tenantId: tenantId
     });
  } catch (error) {
     logger.error(`[adminDashboardRoutes.js] Forms route: Error fetching forms for tenantId: ${tenantId}. Error: ${error.message}`);
     throw error;
  }
 });

// 添加Account & Billing页面的路由
router.get('/account/:tenantId', checkAuth, async (ctx) => {
  const tenantId = ctx.params.tenantId;
  try {
     logger.info(`[adminDashboardRoutes.js] Account route: Rendering account page for tenantId: ${tenantId}`);
     await ctx.render('account', {
       title: 'Account & Billing',
       user: ctx.session.user || null,
       tenantId: tenantId
     });
  } catch (error) {
     logger.error(`[adminDashboardRoutes.js] Account route: Error rendering account page for tenantId: ${tenantId}. Error: ${error.message}`);
     throw error;
  }
 });

//   添加登出路由
router.get('/logout/:tenantId', async (ctx) => {
  try {
     logger.info(`[adminDashboardRoutes.js] Logout route: Clearing user session for tenantId: ${ctx.params.tenantId}`);
     ctx.session = null;
     ctx.redirect('/login');
  } catch (error) {
     logger.error(`[adminDashboardRoutes.js] Logout route: Error clearing user session for tenantId: ${ctx.params.tenantId}. Error: ${error.message}`);
     throw error;
  }
 });

module.exports = router;
