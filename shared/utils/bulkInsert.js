const knex = require("knex")({
  client: "sqlite3", // 根据你的数据库类型进行更改
  connection: {
    filename: "../../gpts4leads-saas-app.db", // 更改为你的数据库文件路径
  },
  useNullAsDefault: true, // SQLite特定设置
});

const insertData = async () => {
  try {
    // 准备数据
    const data = [];
    for (let i = 1; i <= 100; i++) {
      data.push({
        FormID: 5, // 假设FormID为1，根据需要更改
        Data: JSON.stringify({
          "Customer Name": `Customer${i}`,
          Feedback: `Feedback${i}`,
        }),
        SubmittedBy: `user${i}`,
        IsDeleted: 0,
      });
    }

    // 分批插入数据
    const batchSize = 100; // 每批插入的数据量
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await knex("FormData").insert(batch);
    }

    console.log("数据插入成功");
  } catch (error) {
    console.error("数据插入失败:", error);
  } finally {
    await knex.destroy();
  }
};

insertData();