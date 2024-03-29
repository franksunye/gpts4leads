// migrations/add_uuid_to_users.js

const { generateSixDigitNumericUUID } = require('../shared/utils/uuid');

exports.up = function(knex) {
    return knex.schema.table('Users', function(table) {
        // 添加一个允许NULL值的UUID字段
        table.string('UUID', 6).nullable().unique();
    })
    .then(() => {
        // 为现有记录生成UUID
        return knex('Users').select('*').then(rows => {
            const updates = rows.map(row => {
                const uuid = generateSixDigitNumericUUID();
                return knex('Users')
                    .where('UserID', row.UserID) // 使用正确的主键列名
                    .update({ UUID: uuid });
            });
            return Promise.all(updates);
        });
    });
};

exports.down = function(knex) {
    return knex.schema.table('Users', function(table) {
        // 移除UUID字段
        table.dropColumn('UUID');
    });
};