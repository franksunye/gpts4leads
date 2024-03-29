const assert = require('assert');
const { generateSixDigitNumericUUID, generateLowercaseAlphanumericUUID } = require('../shared/utils/uuid');

describe('UUID Generation', function() {
    it.only('should generate a six-digit numeric UUID', function() {
        const uuid = generateSixDigitNumericUUID();
        console.log(`Generated UUID: ${uuid}`);
        assert.strictEqual(typeof uuid, 'string');
        assert.strictEqual(uuid.length, 6);
        assert.match(uuid, /^\d+$/); // 确保UUID只包含数字
    });

    it.only('should generate a 16-character lowercase alphanumeric UUID', function() {
        const uuid = generateLowercaseAlphanumericUUID();
        console.log(`Generated UUID: ${uuid}`);
        assert.strictEqual(typeof uuid, 'string');
        assert.strictEqual(uuid.length, 16);
        assert.match(uuid, /^[a-z0-9]+$/); // 确保UUID只包含小写字母和数字
    });
});