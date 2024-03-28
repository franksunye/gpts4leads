// tenantService.test.js

const assert = require("assert");
const tenantService = require("../shared/services/tenantService");
const tenantModel = require("../shared/models/tenantModel");

describe("Tenant Service", () => {
 describe("setStripeCustomerIdForTenant", () => {
    it("should set the Stripe customer ID for a given tenant ID", async () => {
      // 假设已经创建了一个租户
      const tenantId = "1"; // 替换为实际的租户ID
      const stripeCustomerId = "cus_123456789"; // 假设的Stripe客户ID

      try {
        // 调用setStripeCustomerIdForTenant函数
        const result = await tenantService.setStripeCustomerIdForTenant(tenantId, stripeCustomerId);

        // 验证函数的返回值
        assert(result, "Function should return true on success");

        // 验证租户的Stripe客户ID是否已被设置
        const updatedTenant = await tenantModel.findById(tenantId);
        assert.equal(updatedTenant.StripeCustomerId, stripeCustomerId, "Tenant's Stripe customer ID should match");
      } catch (error) {
        assert.fail(`Test failed with error: ${error.message}`);
      }
    });
 });
});