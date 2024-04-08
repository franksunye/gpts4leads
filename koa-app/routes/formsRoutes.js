// koa-app/routes/formsRoutes.js

const Router = require('koa-router');
const formsController = require('../controllers/formsController');

const router = new Router({
    prefix: '/api' //  添加路径前缀
  });

router.post('/forms', formsController.createForm);
router.get('/forms', formsController.getAllForms);
router.get('/forms/:id', formsController.getFormById);
router.put('/forms/:id', formsController.updateForm);
router.delete('/forms/:uuid', formsController.deleteFormAndData);

// 升级为租户模式
router.get('/forms/tenant/:tenantId', formsController.getFormsByTenantId);
router.delete('/forms/tenant/:tenantUuid', formsController.deleteFormByTenantUuid);

module.exports = router;
