const { generateLowercaseAlphanumericUUID } = require('../shared/utils/uuid');

exports.up = function(knex) {
    return knex.schema.table('FormData', function(table) {
        // 添加一个允许NULL值的UUID字段
        table.uuid('UUID').nullable().unique();
    })
    .then(() => {
        // 为现有记录生成UUID
        return knex('FormData').select('EntryID').then(rows => {
            const updates = rows.map(row => {
                const uuid = generateLowercaseAlphanumericUUID();
                return knex('FormData')
                    .where('EntryID', row.EntryID)
                    .update({ UUID: uuid });
            });
            return Promise.all(updates);
        });
    });
};

exports.down = function(knex) {
    return knex.schema.table('FormData', function(table) {
        // 移除UUID字段
        table.dropColumn('UUID');
    });
};

