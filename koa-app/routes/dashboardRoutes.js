// dashboardRoutes.js
const Router = require('koa-router');
const logger = require('../../shared/utils/logger');
const formService = require('../../shared/services/formService');
const formDataService = require('../../shared/services/formDataService');
const fieldService = require('../../shared/services/fieldService');
const tenantService = require('../../shared/services/tenantService');

const router = new Router();

// 权限检查中间件
async function checkAuth(ctx, next) {
  if (!ctx.session.user) { // 假设使用session存储登录状态
    logger.info('[dashboardRoutes.js] checkAuth: User not authenticated, redirecting to login');
    ctx.redirect('/login');
  } else {
    await next();
  }
}

//   根目录路由处理函数
router.get('/', async (ctx) => {
  if (ctx.session.user) {
    logger.info(`[dashboardRoutes.js] Root route: User is authenticated, redirecting to home`);
    ctx.redirect(`/home/${ctx.session.user.tenantUuid}`);
  } else {
    logger.info('[dashboardRoutes.js] Root route: User not authenticated, redirecting to login');
    ctx.redirect('/login');
  }
});

//   定义路由来渲染首页
router.get('/home/:tenantUuid', checkAuth, async (ctx) => {
  const tenantUuid = ctx.params.tenantUuid;
  const tenantId = ctx.session.user.tenantId;

  try {
     const totalSubmissionCount = await formDataService.countFormDataByTenantId(tenantId);
     const uniqueSubmissionCount = await formDataService.countUniqueFieldByTenantId(tenantId, "Email");
     const formDataCountByDateRange = await formDataService.getFormDataCountByDateRange(tenantId, "2024-01-01", "2024-12-31");
     const formDataCountByDateRangeAndUniqueField = await formDataService.getFormDataCountByDateRangeAndUniqueField(tenantId, "Email", "2024-01-01", "2024-12-31");
     const formCount = await formService.countFormsByTenantId(tenantId);

     logger.info(`[dashboardRoutes.js] Home route: Rendering home page for tenantUuid: ${tenantUuid}`);
     await ctx.render('index', {
       title: 'Admin Dashboard',
       user: ctx.session.user || null,
       tenantId: tenantId,
       tenantUuid: tenantUuid,
       totalFormDataCount: totalSubmissionCount,
       uniqueEmailCount: uniqueSubmissionCount,
       formDataCountByDateRange,
       formDataCountByDateRangeAndUniqueField,
       formCount
     });
  } catch (error) {
     logger.error(`[dashboardRoutes.js] Home route: Error rendering home page for tenantId: ${tenantId}. Error: ${error.message}`);
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

router.get('/forms/:tenantUuid', checkAuth, async (ctx) => {
  const tenantId = ctx.session.user.tenantId;
  const page = parseInt(ctx.query.page) || 1; // 获取页码，默认为1
  const limit = parseInt(ctx.query.limit) || 5; // 每页记录数，默认为10
  const offset = (page - 1) * limit; // 计算偏移量
 
  try {
     const forms = await formService.getFormsByTenantIdWithPaginationAndCount(tenantId, offset, limit);
     const total = await formService.countFormsByTenantId(tenantId);
     const totalPages = Math.ceil(total / limit);
 
     await ctx.render('forms', {
         title: 'Forms Dashboard',
         user: ctx.session.user || null,
         forms: forms,
         tenantId: tenantId,
         tenantUuid: ctx.session.user.tenantUuid,
         page: page,
         totalPages: totalPages,
         limit, limit,
         total,total,
     });
  } catch (error) {
     logger.error(`[dashboardRoutes.js] Forms route: Error fetching forms for tenantId: ${tenantId}. Error: ${error.message}`);
     throw error;
  }
 });

router.get('/forms/:tenantUuid/create', checkAuth, async (ctx) => {
  const tenantUuid = ctx.params.tenantUuid;
  const tenantId = ctx.session.user.tenantId; // 假设租户ID是从session中获取的
 
  try {
     logger.info(`[dashboardRoutes.js] Create Form route: Rendering create form page for tenantUuid: ${tenantUuid}`);

     const planDetails = await tenantService.getPlanDetailsByTenantUUID(tenantUuid);

     await ctx.render('createForm', {
       title: 'Create Form',
       user: ctx.session.user || null,
       tenantId: tenantId,
       tenantUuid: tenantUuid,
       planDetails: planDetails,
     });
  } catch (error) {
     logger.error(`[dashboardRoutes.js] Create Form route: Error rendering create form page for tenantUuid: ${tenantUuid}. Error: ${error.message}`);
     throw error;
  }
 });

 router.get('/submissions/:tenantUuid/form/:formUuid', checkAuth, async (ctx) => {
  const tenantId = ctx.session.user.tenantId;
  const formUuid = ctx.params.formUuid;
  const page = parseInt(ctx.query.page) || 1; // 获取页码，默认为1
  const limit = parseInt(ctx.query.limit) || 5; // 每页记录数，默认为10
  const offset = (page - 1) * limit; // 计算偏移量

  try {
      logger.info(`[dashboardRoutes.js] Submission route: Rendering submission page for tenantId: ${tenantId}`);

      const formId = await formService.getFormIdByUuid(formUuid);
      const formData = await formDataService.getFormDataByIdWithPagination(formId, offset, limit);
      // logger.debug(`[dashboardRoutes.js] Form data for formId: ${formId} - ${JSON.stringify(formData, null, 2)}`);
      const total = await formDataService.countFormDataByFormId(formId);
      const totalPages = Math.ceil(total / limit);

      const fields = await fieldService.getFieldsByFormId(formId);

      await ctx.render('form', {
          title: 'Form Submission',
          user: ctx.session.user || null,
          tenantId: tenantId,
          tenantUuid: ctx.session.user.tenantUuid,
          formId: formId,
          formUuid: formUuid,
          formData: formData,
          page: page,
          totalPages: totalPages,
          limit: limit,
          total: total,
          fields: fields
      });
  } catch (error) {
      logger.error(`[dashboardRoutes.js] Form submission route: Error rendering form submission page for tenantId: ${tenantId} and formId: ${formId}. Error: ${error.message}`);
      throw error;
  }
});

router.get('/account/:tenantUuid', checkAuth, async (ctx) => {
  const tenantId = ctx.session.user.tenantId;
  try {
     logger.info(`[dashboardRoutes.js] Account route: Rendering account page for tenantId: ${tenantId}`);
     const userEmail = ctx.session.user.email;
     logger.debug(`[dashboardRoutes.js] Account route: User email for tenantId ${tenantId}: ${userEmail}`);

     await ctx.render('account', {
       title: 'Account & Billing',
       user: ctx.session.user || null,
       subscription: ctx.session.subscription || null,
       tenantId: tenantId,
       tenantUuid: ctx.session.user.tenantUuid,
       userEmail: userEmail
     });
  } catch (error) {
     logger.error(`[dashboardRoutes.js] Account route: Error rendering account page for tenantId: ${tenantId}. Error: ${error.message}`);
     throw error;
  }
 });

router.get('/logout/:tenantUuid', async (ctx) => {
  try {
     logger.info(`[dashboardRoutes.js] Logout route: Clearing user session for tenantId: ${ctx.params.tenantId}`);
     ctx.session = null;
     ctx.redirect('/login');
  } catch (error) {
     logger.error(`[dashboardRoutes.js] Logout route: Error clearing user session for tenantId: ${ctx.params.tenantId}. Error: ${error.message}`);
     throw error;
  }
 });

module.exports = router;
