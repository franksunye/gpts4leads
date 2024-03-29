// migrations/add_uuid_to_fields.js

const { generateTwelveDigitUUID } = require('../shared/utils/uuid');

exports.up = function(knex) {
    return knex.schema.table('Fields', function(table) {
        // 添加一个允许NULL值的UUID字段
        table.string('UUID', 12).nullable().unique();
    })
    .then(() => {
        // 为现有记录生成UUID
        return knex('Fields').select('*').then(rows => {
            const updates = rows.map(row => {
                const uuid = generateTwelveDigitUUID();
                return knex('Fields')
                    .where('FieldID', row.FieldID) // 使用正确的主键列名
                    .update({ UUID: uuid });
            });
            return Promise.all(updates);
        });
    });
};

exports.down = function(knex) {
    return knex.schema.table('Fields', function(table) {
        // 移除UUID字段
        table.dropColumn('UUID');
    });
};