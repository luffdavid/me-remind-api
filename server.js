const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express()
const userRoutes = require('./routes/user')

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

app.use(cors());
app.use(express.json());
app.use('/auth/user', userRoutes);


mongoose.connect(
"mongodb+srv://ADMIN:ADMIN@reminder-cluster.copnp48.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to DB"))
.catch(console.error);

//import Todo SCHEMA 
//Todo = Todo model
//todos = all todos
//creating a new Todo = todo
const Todo = require('./models/Todo');

app.get('/todos', async(req, res) => {
  const userId = req.query.userId;

    try {
        const todos = await Todo.find({ userId });
        res.json(todos);
      } catch (error) {
        console.error(error); // Weiterleitung an Fehlerbehandlung
      }
  });

app.post('/todo/new', async (req, res, next) => {
   try {
    const todo = new Todo({
        userId: req.body.userId,
        text : req.body.text,
        dueDate: req.body.dueDate,
        description: req.body.description
    });
   await todo.save();
   res.json(todo);
} catch(error) {
    console.error(error);
}
});

app.delete('/todo/delete/:id', async (req, res, next) => {
    try {
      const result = await Todo.findByIdAndDelete(req.params.id);
      res.json({ result });
    } catch (error) {
      console.error(error); // Weiterleitung an Fehlerbehandlung
    }
});

app.get('/todo/complete/:id', async (req, res) => {
    try {
	const todo = await Todo.findById(req.params.id);

	todo.complete = !todo.complete;

	todo.save();

	res.json(todo);
} catch (error) {
    console.error(error); // Weiterleitung an Fehlerbehandlung
  }
})

app.put('/todo/update/:id', async (req, res) => {
	try {
    const todo = await Todo.findById(req.params.id);

	todo.text = req.body.text;
  todo.dueDate = req.body.dueDate;
  todo.description = req.body.description;

	todo.save();

	res.json(todo);
    } catch (error){
        console.error(error);
    }
});



app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

app.listen(3001, () => console.log("Server running on port 3001"));