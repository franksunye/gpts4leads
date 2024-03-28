const knex = require('knex')({
 client: 'sqlite3', // 根据你的数据库类型进行更改
 connection: {
    filename: '../../gpts4leads-saas-app.db' // 更改为你的数据库文件路径
 },
 useNullAsDefault: true // SQLite特定设置
});

const testQueryPerformance = async () => {
 try {
    // 开始计时
    const startTime = Date.now();

    // 执行查询
    const result = await knex('FormData')
      .select('*')
      .where('IsDeleted', 0)
      .limit(1000); // 限制结果数量以减少加载时间

    // 结束计时
    const endTime = Date.now();

    console.log(`查询结果数量: ${result.length}`);
    console.log(`查询执行时间: ${endTime - startTime} 毫秒`);
 } catch (error) {
    console.error('查询失败:', error);
 } finally {
    // 关闭数据库连接
    await knex.destroy();
 }
};

const testQueryPerformanceWithSearch = async () => {
    try {
       // 开始计时
       const startTime = Date.now();
   
       // 执行查询，包含关键词搜索
       const result = await knex('FormData')
         .select('*')
         .where('IsDeleted', 0)
         .andWhere('Data', 'LIKE', '%Great%') // 搜索Data字段中包含"Great"的记录
         .limit(1000); // 限制结果数量以减少加载时间
   
       // 结束计时
       const endTime = Date.now();
   
       console.log(`查询结果数量: ${result.length}`);
       console.log(`查询执行时间: ${endTime - startTime} 毫秒`);

       console.log('查询结果:', result);

    } catch (error) {
       console.error('查询失败:', error);
    } finally {
       // 关闭数据库连接
       await knex.destroy();
    }
   };

// testQueryPerformance();
testQueryPerformanceWithSearch();
