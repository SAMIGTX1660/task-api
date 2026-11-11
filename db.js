import Database from 'better-sqlite3';

const db = new Database('tasks.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);

const row = db.prepare('SELECT COUNT(*) AS count FROM tasks').get();

if (row.count === 0) {
  const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  insert.run('Write my first task', 0);
  insert.run('Write my second task', 0);
  insert.run('Write my third task', 0);
}
export default db;
