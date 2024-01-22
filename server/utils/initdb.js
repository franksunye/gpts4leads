const sqlite3 = require('sqlite3').verbose();

// 连接到 SQLite 数据库
const db = new sqlite3.Database('./gpts4leads-saas-app.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// 创建表
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tenants (
            TenantID INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT NOT NULL,
            CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            CreatedBy TEXT,
            IsDeleted BOOLEAN DEFAULT 0
          )`);

  // 您可以在这里添加更多的 CREATE TABLE 语句来创建其他表
});

// 关闭数据库连接
db.close((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Closed the database connection.');
  }
});
