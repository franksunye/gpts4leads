const knex = require("knex")({
  client: "sqlite3", // 根据你的数据库类型进行更改
  connection: {
    filename: "../../leadgen-gpt-app.db", // 更改为你的数据库文件路径
  },
  useNullAsDefault: true, // SQLite特定设置
});
const { generateLowercaseAlphanumericUUID } = require("../utils/uuid");

const insertData = async () => {
  try {
    // 准备数据
    const data = [];
    for (let i = 1; i <= 50; i++) {
      const uuid = generateLowercaseAlphanumericUUID(); // 为每条数据生成一个UUID
      data.push({
        form_id: 7, // 根据新的要求，FormID被设置为2
        data: JSON.stringify({
          username: `User${i}`,
          email: `user${i}@openai.com`,
          password: `password${i}`,
          confirmPassword: `password${i}`,
          dateOfBirth: `1990-01-01`, // 假设所有用户的生日为1990年1月1日
        }),
        submitted_by: `user${i}`,
        is_deleted: 0,
        uuid: uuid, // 添加UUID字段
      });
    }

    // 分批插入数据
    const batchSize = 100; // 每批插入的数据量
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await knex("form_data").insert(batch);
    }

    console.log("数据插入成功");
  } catch (error) {
    console.error("数据插入失败:", error);
  } finally {
    await knex.destroy();
  }
};

insertData();