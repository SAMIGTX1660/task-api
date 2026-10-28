let tasks=[
  {id:1, title:"Task 1", done:false},
   {id:2, title:"Task 2", done:true}, 
   {id:3, title:"Task 3", done:false}
 ]

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi.json');
const app = express();
app.use(express.json());
const port = 3000;

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.get('/', (req, res) => {
  res.json({
    "name": "Task API", 
    "version": "1.0", 
    "endpoints": ["/tasks"]});
});
app.get('/health', (req, res) => {
  res.json({"status": "ok"});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id)); //req.params.id is the id value taken from the URL
  if (!task) {
    return res.status(404).json({"error": `Task ${req.params.id} not found`});
  }
  res.json(task);
});

let nextId = 4;

app.post('/tasks', (req, res) => {
  const title = req.body && req.body.title;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const task = { id: nextId, title: title.trim(), done: false };
  nextId = nextId + 1;
  tasks.push(task);

  res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
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

  if ('title' in body) {
    task.title = body.title.trim();
  }
  if ('done' in body) {
    task.done = body.done;
  }

  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === Number(req.params.id));
  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).end();
});