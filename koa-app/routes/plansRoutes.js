const Router = require('koa-router');
const plansController = require('../controllers/plansController');

const router = new Router();

router.post('/plans', plansController.createPlan);
router.get('/plans', plansController.getAllPlans);
router.get('/plans/:id', plansController.getPlanById);
router.put('/plans/:id', plansController.updatePlan);
router.delete('/plans/:id', plansController.deletePlan);

module.exports = router;
