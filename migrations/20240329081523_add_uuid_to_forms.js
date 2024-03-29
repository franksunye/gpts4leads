// migrations/add_uuid_to_forms.js

const { generateTenDigitNumericUUID } = require('../shared/utils/uuid');

exports.up = function(knex) {
    return knex.schema.table('Forms', function(table) {
        // 添加一个允许NULL值的UUID字段
        table.string('UUID', 10).nullable().unique();
    })
    .then(() => {
        // 为现有记录生成UUID
        return knex('Forms').select('*').then(rows => {
            const updates = rows.map(row => {
                const uuid = generateTenDigitNumericUUID();
                return knex('Forms')
                    .where('FormID', row.FormID) // 使用正确的主键列名
                    .update({ UUID: uuid });
            });
            return Promise.all(updates);
        });
    });
};

exports.down = function(knex) {
    return knex.schema.table('Forms', function(table) {
        // 移除UUID字段
        table.dropColumn('UUID');
    });
};