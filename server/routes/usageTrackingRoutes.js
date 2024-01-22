const Router = require('koa-router');
const usageTrackingController = require('../controllers/usageTrackingController');

const router = new Router();

router.post('/usageTracking', usageTrackingController.createUsageTracking);
router.get('/usageTracking', usageTrackingController.getAllUsageTrackings);
router.get('/usageTracking/:id', usageTrackingController.getUsageTrackingById);
router.put('/usageTracking/:id', usageTrackingController.updateUsageTracking);
router.delete('/usageTracking/:id', usageTrackingController.deleteUsageTracking);

module.exports = router;
