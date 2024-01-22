const Router = require('koa-router');
const formsController = require('../controllers/formsController');

const router = new Router();

router.post('/forms', formsController.createForm);
router.get('/forms', formsController.getAllForms);
router.get('/forms/:id', formsController.getFormById);
router.put('/forms/:id', formsController.updateForm);
router.delete('/forms/:id', formsController.deleteForm);

module.exports = router;
