const Database = require('better-sqlite3');
const path = require('path');

// إنشاء قاعدة البيانات
const dbPath = path.join(__dirname, 'arab_tribes.db');
const db = new Database(dbPath);

// تفعيل الفحوصات الخارجية
db.pragma('foreign_keys = ON');

// إنشاء جداول قاعدة البيانات
function initializeDatabase() {
  try {
    // جدول المقالات
    db.exec(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        keywords TEXT,
        author TEXT,
        published BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // جدول القبائل
    db.exec(`
      CREATE TABLE IF NOT EXISTS tribes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        lineage TEXT,
        history TEXT,
        notable_sheikhs TEXT,
        region TEXT,
        type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // جدول المستخدمين
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // جدول التعليقات
    db.exec(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        article_id INTEGER,
        user_id INTEGER,
        content TEXT NOT NULL,
        approved BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // إنشاء فهارس
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
      CREATE INDEX IF NOT EXISTS idx_tribes_slug ON tribes(slug);
      CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
    `);

    console.log('✅ تم تهيئة قاعدة البيانات بنجاح');
  } catch (error) {
    console.error('❌ خطأ في تهيئة قاعدة البيانات:', error.message);
  }
}

// تهيئة قاعدة البيانات
initializeDatabase();

// دالة مساعدة للاستعلامات
function query(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return { rows: stmt.all(...params) };
    } else {
      const result = stmt.run(...params);
      return { lastID: result.lastInsertRowid, changes: result.changes };
    }
  } catch (error) {
    console.error('خطأ في الاستعلام:', error.message);
    throw error;
  }
}

module.exports = {
  query,
  db,
  close: () => db.close()
};
