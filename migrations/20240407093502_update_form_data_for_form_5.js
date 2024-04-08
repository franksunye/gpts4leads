// migrations/update_form_data_for_form_5.js

exports.up = function(knex) {
    return knex('FormData')
        .where('FormID', 5)
        .then(rows => {
            const updates = rows.map(row => {
                // 解析Data字段中的JSON字符串
                const data = JSON.parse(row.Data);
                // 增加Email字段，其值为"Customer Name" + "@example.com"
                data.Email = `${data["Customer Name"]}@example.com`;
                // 将更新后的数据转换回JSON字符串
                const updatedData = JSON.stringify(data);
                // 更新记录
                return knex('FormData')
                    .where('EntryID', row.EntryID) // 使用正确的主键列名
                    .update({ Data: updatedData });
            });
            return Promise.all(updates);
        });
};

exports.down = function(knex) {
    // 撤销更改的逻辑可能会更复杂，因为我们需要知道原始的Data字段的内容
    // 这里我们假设在up函数中没有改变原始的Data字段的结构，只是增加了Email字段
    // 因此，我们可以简单地移除Email字段来撤销更改
    return knex('FormData')
        .where('FormID', 5)
        .then(rows => {
            const updates = rows.map(row => {
                // 解析Data字段中的JSON字符串
                const data = JSON.parse(row.Data);
                // 移除Email字段
                delete data.Email;
                // 将更新后的数据转换回JSON字符串
                const updatedData = JSON.stringify(data);
                // 更新记录
                return knex('FormData')
                    .where('EntryID', row.EntryID) // 使用正确的主键列名
                    .update({ Data: updatedData });
            });
            return Promise.all(updates);
        });
};