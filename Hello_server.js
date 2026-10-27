let tasks=[
  {id:1, name:"Task 1", done:false},
   {id:2, name:"Task 2", done:true}, 
   {id:3, name:"Task 3", done:false}
 ]

const express = require('express');
const app = express();
const port = 3000;

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
