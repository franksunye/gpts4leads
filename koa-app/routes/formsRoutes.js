// koa-app/routes/formsRoutes.js

const Router = require('koa-router');
const formsController = require('../controllers/formsController');
const openaiService = require('../../shared/services/openaiService');
const logger = require('../../shared/utils/logger');
const usageTrackingService = require('../../shared/services/usageTrackingService'); // 引入usageTrackingService

const router = new Router({
    prefix: '/api'
  });

router.post('/forms', formsController.createForm);
router.get('/forms', formsController.getAllForms);
router.get('/forms/:id', formsController.getFormById);
router.put('/forms/:id', formsController.updateForm);
router.delete('/forms/:uuid', formsController.deleteFormAndData);

// 升级为租户模式
router.get('/forms/tenant/:tenantId', formsController.getFormsByTenantId);
router.delete('/forms/tenant/:tenantUuid', formsController.deleteFormByTenantUuid);
router.post('/forms/tenant/:tenantUuid', formsController.createFormAndFields);

router.get('/generate-content/:tenantUuid', async (ctx) => {
  try {
    const tenantUuid = ctx.params.tenantUuid;
    const mockData = await openaiService.getMockData();
    logger.info(`[formsRoutes.js] /forms/generate-content: Successfully generated content: ${JSON.stringify(mockData)}`);

    const usageData = await usageTrackingService.getUsageByTenantUUID(tenantUuid);
    const LLMCallCount = usageData.LLMCallCount; // 假设usageData是一个对象，包含LLMCallCount字段

    const newLLMCallCount = LLMCallCount + 1;

    const newUsageData = { LLMCallCount: newLLMCallCount }; // 假设需要更新的数据结构
    await usageTrackingService.updateUsageByTenantUUID(tenantUuid, newUsageData);
    
    ctx.body = mockData;

  } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to generate content' };
      logger.error('Error generating content:', error);
  }
});

module.exports = router;
