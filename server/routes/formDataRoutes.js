const Router = require('koa-router');
const formDataController = require('../controllers/formDataController');

const router = new Router();

router.post('/formData', formDataController.createFormData);
router.get('/formData', formDataController.getAllFormData);
router.get('/formData/:id', formDataController.getFormDataById);
router.put('/formData/:id', formDataController.updateFormData);
router.delete('/formData/:id', formDataController.deleteFormData);

module.exports = router;
