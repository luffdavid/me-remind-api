const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express()


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

app.use(cors());
app.use(express.json());


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
    try {
        const todos = await Todo.find();
        res.json(todos);
      } catch (error) {
        console.error(error); // Weiterleitung an Fehlerbehandlung
      }
  });

app.post('/todo/new', async (req, res, next) => {
   try {
    const todo = new Todo({
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

const SignUp = require('./models/SignUp');

app.post('/auth/signup', async (req, res, next) => {
  try {
    // Überprüfe, ob die E-Mail bereits in der Datenbank existiert
    const existingUser = await SignUp.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'E-Mail existiert bereits' });
    }

    // Wenn die E-Mail noch nicht existiert, erstelle einen neuen Benutzer
    const user = new SignUp({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fehler bei der Registrierung' });
  }
});

const Login = require('./models/Login');

app.post('/auth/login', async (req, res, next) => {
  try {
    // Suchen des Benutzers anhand der E-Mail-Adresse
    const user = await SignUp.findOne({ email: req.body.email });

    // Überprüfe, ob der Benutzer existiert
    if (!user) {
      return res.status(401).json({ message: 'Benutzer nicht gefunden' });
    }

    // Überprüfe das Passwort
    if (user.password !== req.body.password) {
      return res.status(401).json({ message: 'Falsches Passwort' });
    }

    // Wenn alles erfolgreich ist, kannst du eine Erfolgsantwort senden
    res.json({ message: 'Anmeldung erfolgreich' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler bei der Anmeldung' });
  }
});



app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

app.listen(3001, () => console.log("Server running on port 3001"));