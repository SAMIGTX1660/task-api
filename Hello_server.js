import express from 'express';
import swaggerUi from 'swagger-ui-express';
import openapiSpec from './openapi.json' with { type: 'json' };
const app = express();
app.use(express.json());
const port = 3000;
import db from './db.js';
const tasks = db.prepare('SELECT * FROM tasks').all();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.get('/', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks').all();
  res.json(tasks);
});

app.get('/health', (req, res) => {
  res.json({"status": "ok"});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get('/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks').all();
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) {
    return res.status(404).json({"error": `Task ${req.params.id} not found`});
  }
  res.json(task);
});

let nextId = 4;

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required' });
  }
  const result = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)').run(title.trim(), 0);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Request body must include title or done' });
  }

  const fields = Object.keys(body);
  if (
    fields.length === 0 ||
    fields.some(field => field !== 'title' && field !== 'done') ||
    ('title' in body && (typeof body.title !== 'string' || body.title.trim() === '')) ||
    ('done' in body && typeof body.done !== 'boolean')
  ) {
    return res.status(400).json({ error: 'Request body must include a valid title or done value' });
  }

  const newTitle = 'title' in body ? body.title.trim() : task.title;
  const newDone = 'done' in body ? (body.done ? 1 : 0) : task.done;

  db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?').run(newTitle, newDone, id);

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json(updated);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  res.status(204).end();
});