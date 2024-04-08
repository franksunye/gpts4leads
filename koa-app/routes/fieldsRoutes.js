const Router = require('koa-router');
const fieldsController = require('../controllers/fieldsController');

const router = new Router();

router.post('/fields', fieldsController.createField);
router.get('/fields', fieldsController.getAllFields);
router.get('/fields/:id', fieldsController.getFieldById);
router.put('/fields/:id', fieldsController.updateField);
router.delete('/fields/:id', fieldsController.deleteField);

router.get('/fields/form/:formId', fieldsController.getFieldsByFormId);

module.exports = router;
