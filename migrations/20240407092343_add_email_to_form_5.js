// migrations/add_email_field_to_form_5.js

const { generateTwelveDigitUUID } = require('../shared/utils/uuid');

exports.up = function(knex) {
    // 生成一个新的UUID
    const newUUID = generateTwelveDigitUUID();

    return knex('Fields').insert({
        FormID: 5,
        Name: 'Email',
        Type: 'TEXT', // 假设电子邮件字段的类型是文本
        Constraints: 'NOT NULL', // 根据需要设置约束
        CreatedBy: 'system', // 根据需要设置创建者
        IsDeleted: 0,
        UUID: newUUID // 使用生成的UUID
    });
};

exports.down = function(knex) {
    // 使用FormID和Name来匹配记录
    return knex('Fields')
        .where('FormID', 5)
        .andWhere('Name', 'Email')
        .del();
};