// formDataService.test.js

const assert = require("assert");
const formDataService = require("../shared/services/formDataService");
const logger = require('../shared/utils/logger');

describe("Form Data Service", () => {
    describe("countUniqueFieldByTenantId", () => {
        it("should count the unique emails for a given tenant ID", async () => {
            // 设置预期的租户ID和字段名
            const tenantId = "3"; // 替换为实际的租户ID
            const fieldName = "Email";

            const startTime = new Date();
            try {
                // 调用 countUniqueFieldByTenantId 函数
                const count = await formDataService.countUniqueFieldByTenantId(tenantId, fieldName);
                const endTime = new Date();
                const executionTime = endTime - startTime;
                logger.info(`Execution time for counting unique ${fieldName} for tenantId ${tenantId}: ${executionTime} ms`);

                // 断言函数的输出是否符合预期
                // 这里的断言应该根据实际情况进行调整
                // 例如，如果你知道某个租户ID下有多少个唯一的电子邮件地址，你可以检查计数是否匹配
                assert(count >= 0, "Count should be a non-negative number");
                // 添加更多的断言来检查其他条件

            } catch (error) {
                assert.fail(`Test failed with error: ${error.message}`);
            }
        });
    });
});

describe("countFormDataByTenantId", () => {
    it("should count the form data for a given tenant ID", async () => {
        // 设置预期的租户ID
        const tenantId = "3"; // 替换为实际的租户ID

        try {
            // 调用 countFormDataByTenantId 函数
            const count = await formDataService.countFormDataByTenantId(tenantId);

            // 断言函数的输出是否符合预期
            // 这里的断言应该根据实际情况进行调整
            // 例如，如果你知道某个租户ID下有多少个表单数据，你可以检查计数是否匹配
            assert(count >= 0, "Count should be a non-negative number");
            // 添加更多的断言来检查其他条件

        } catch (error) {
            assert.fail(`Test failed with error: ${error.message}`);
        }
    });
});

describe("getFormDataCountByDateRange", () => {
    it.only("should return the count of form data by date range for a specific tenant", async () => {
        // 设置预期的租户ID、日期范围
        const tenantId = "3"; // 替换为实际的租户ID
        const startDate = "2024-01-01"; // 替换为实际的开始日期
        const endDate = "2024-12-31"; // 替换为实际的结束日期

        try {
            // 调用 getFormDataCountByDateRange 函数
            const result = await formDataService.getFormDataCountByDateRange(tenantId, startDate, endDate);
            logger.info(`Test result for date range from ${startDate} to ${endDate} for tenantId ${tenantId}: ${JSON.stringify(result, null, 2)}`);

            // 断言函数的输出是否符合预期
            // 这里的断言应该根据实际情况进行调整
            assert(Array.isArray(result), "Result should be an array");
            assert(result.length > 0, "Result array should not be empty");
            result.forEach(item => {
                assert(item.date, "Each item should have a date property");
                assert(typeof item.count === 'number', "Count should be a number");
                assert(item.count >= 0, "Count should be a non-negative number");
            });

            // 添加更多的断言来检查其他条件

        } catch (error) {
            assert.fail(`Test failed with error: ${error.message}`);
        }
    });
});

describe("getFormDataCountByDateRangeAndUniqueField", () => {
    it.only("should return the count of form data by date range for a specific tenant and unique field", async () => {
        // 设置预期的租户ID、唯一字段名、日期范围
        const tenantId = "3"; // 替换为实际的租户ID
        const uniqueField = "Email"; // 替换为实际的唯一字段名
        const startDate = "2024-01-01"; // 替换为实际的开始日期
        const endDate = "2024-12-31"; // 替换为实际的结束日期

        try {
            // 调用 getFormDataCountByDateRangeAndUniqueField 函数
            const result = await formDataService.getFormDataCountByDateRangeAndUniqueField(tenantId, uniqueField, startDate, endDate);
            logger.info(`Test result for date range from ${startDate} to ${endDate} for tenantId ${tenantId} and unique field ${uniqueField}: ${JSON.stringify(result, null, 2)}`);

            // 断言函数的输出是否符合预期
            // 这里的断言应该根据实际情况进行调整
            assert(Array.isArray(result), "Result should be an array");
            assert(result.length > 0, "Result array should not be empty");
            result.forEach(item => {
                assert(item.date, "Each item should have a date property");
                assert(typeof item.count === 'number', "Count should be a number");
                assert(item.count >= 0, "Count should be a non-negative number");
            });

            // 添加更多的断言来检查其他条件

        } catch (error) {
            assert.fail(`Test failed with error: ${error.message}`);
        }
    });
});