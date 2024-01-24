const Router = require('koa-router');
const tenantsController = require('../controllers/tenantsController');

const router = new Router();

router.post('/tenants', tenantsController.createTenant);
router.get('/tenants', tenantsController.getAllTenants);
router.get('/tenants/:id', tenantsController.getTenantById);
router.put('/tenants/:id', tenantsController.updateTenant);
router.delete('/tenants/:id', tenantsController.deleteTenant);

module.exports = router;
