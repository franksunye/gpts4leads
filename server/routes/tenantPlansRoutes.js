const Router = require('koa-router');
const tenantPlansController = require('../controllers/tenantPlansController');

const router = new Router();

router.post('/tenantPlans', tenantPlansController.createTenantPlan);
router.get('/tenantPlans', tenantPlansController.getAllTenantPlans);
router.get('/tenantPlans/:id', tenantPlansController.getTenantPlanById);
router.put('/tenantPlans/:id', tenantPlansController.updateTenantPlan);
router.delete('/tenantPlans/:id', tenantPlansController.deleteTenantPlan);

module.exports = router;
