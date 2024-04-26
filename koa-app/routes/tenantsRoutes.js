const Router = require('koa-router');
const tenantsController = require('../controllers/tenantsController');
const tenantService = require('../../shared/services/tenantService');

const router = new Router({
    prefix: '/api'
  });

router.post('/tenants', tenantsController.createTenant);
router.get('/tenants', tenantsController.getAllTenants);
router.get('/tenants/:id', tenantsController.getTenantById);
router.put('/tenants/:id', tenantsController.updateTenant);
router.delete('/tenants/:id', tenantsController.deleteTenant);

router.get('/tenants/:tenantUUID/plan', async (ctx) => {
    const { tenantUUID } = ctx.params;
    try {
       const planDetails = await tenantService.getPlanDetailsByTenantUUID(tenantUUID);
       ctx.body = planDetails;
    } catch (error) {
       ctx.status = 500; // 设置响应状态码为500，表示服务器错误
       ctx.body = { error: error.message };
    }
   });

module.exports = router;
