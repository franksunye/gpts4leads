const Router = require('koa-router');
const formsController = require('../controllers/formsController');

const router = new Router({
    prefix: '/api' //  添加路径前缀
  });

router.post('/forms', formsController.createForm);
router.get('/forms', formsController.getAllForms);
router.get('/forms/:id', formsController.getFormById);
router.put('/forms/:id', formsController.updateForm);
router.delete('/forms/:id', formsController.deleteForm);

// 升级为租户模式
router.get('/forms/:tenantId', formsController.getFormsByTenantId);

module.exports = router;
