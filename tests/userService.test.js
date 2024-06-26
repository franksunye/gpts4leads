// tests/userService.test.js

const assert = require("assert");
const userService = require("../shared/services/userService");

describe("User Service", () => {
 describe("createUserWithTenant", () => {
    it("should create a new user and tenant", async () => {
      const nickname = "testUser";
      const email = "test@example.com";

      try {
        const result = await userService.createUserWithTenant(nickname, email);
        assert(result.user, "User should be created");
        assert(result.tenant, "Tenant should be created");
        assert.equal(result.user.Username, nickname, "User nickname should match");
        assert.equal(result.user.Email, email, "User email should match");
        assert.equal(result.tenant.Name, nickname, "Tenant name should match");
      } catch (error) {
        assert.fail(`Test failed with error: ${error.message}`);
      }
    });
 });

 describe("Soft Delete User", () => {
    it("should soft delete a user", async () => {
      const nickname = "testUser";
      const email = "test@example.com";

      // 假设已经创建了一个用户
      const result = await userService.createUserWithTenant(nickname, email);

      // 调用软删除方法
      await userService.softDeleteUser(result.user.UserID);

      // 验证用户是否已被标记为删除
      const deletedUser = await userService.getUserById(result.user.UserID);
      assert(deletedUser.IsDeleted, "User should be soft deleted");
    });
 });

 describe("Restore User", () => {
    it("should restore a soft deleted user", async () => {
      const nickname = "testUser";
      const email = "test@example.com";

      // 假设已经创建并软删除了一个用户
      const result = await userService.createUserWithTenant(nickname, email);
      await userService.softDeleteUser(result.user.UserID);

      // 调用恢复方法
      await userService.restoreUser(result.user.UserID);

      // 验证用户是否已被恢复
      const restoredUser = await userService.getUserById(result.user.UserID);
      assert(!restoredUser.IsDeleted, "User should be restored");
    });
 });

 describe("getTenantInfoByUserId", () => {
  it("should return the tenant info for a given user ID", async () => {
    // 设置预期的用户ID
    const userId = "17"; // 替换为实际的用户ID

    try {
      // 调用 getTenantInfoByUserId 函数
      const tenantInfo = await userService.getTenantInfoByUserId(userId);

      // 断言函数的输出是否符合预期
      assert(tenantInfo, "Tenant info should be returned");
      assert.equal(tenantInfo.TenantID, "3", "Tenant ID should match");
      // 添加更多的断言来检查其他属性

    } catch (error) {
      assert.fail(`Test failed with error: ${error.message}`);
    }
  });
});

});