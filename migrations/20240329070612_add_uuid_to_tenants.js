const { generateSixDigitNumericUUID } = require('../shared/utils/uuid');

exports.up = function(knex) {
    return knex.schema.table('tenants', function(table) {
        // 添加一个允许NULL值的UUID字段
        table.char('UUID', 6).nullable().unique();
    })
    .then(() => {
        // 为现有记录生成UUID
        return knex('tenants').select('TenantID').then(rows => {
            const updates = rows.map(row => {
                const uuid = generateSixDigitNumericUUID();
                return knex('tenants')
                    .where('TenantID', row.TenantID)
                    .update({ UUID: uuid });
            });
            return Promise.all(updates);
        });
    });
};

exports.down = function(knex) {
    return knex.schema.table('tenants', function(table) {
        // 移除UUID字段
        table.dropColumn('UUID');
    });
};