const Router = require('koa-router');
const billingsController = require('../controllers/billingsController');

const router = new Router();

router.post('/billings', billingsController.createBilling);
router.get('/billings', billingsController.getAllBillings);
router.get('/billings/:id', billingsController.getBillingById);
router.put('/billings/:id', billingsController.updateBilling);
router.delete('/billings/:id', billingsController.deleteBilling);

module.exports = router;
