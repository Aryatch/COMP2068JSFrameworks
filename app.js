// Express and Required Packages
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3002;

// Middleware Setup
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// In-Memory Data Stores
const users = { username: 'user', password: 'pass' }; // Simple user store
let todos = []; // Array to store to-do items

// Authentication Middleware
function isAuthenticated(req, res, next) {
    if (req.session.isLoggedIn) {
        next(); // Proceed if logged in
    } else {
        res.redirect('/login'); // Redirect to login if not authenticated
    }
}

// Routes
// Login Page (GET)
app.get('/login', (req, res) => {
    res.send(`<form method="POST" action="/login">
                <input type="text" name="username" placeholder="Username" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Login</button>
              </form>`);
});

// Login Handler (POST)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === users.username && password === users.password) {
        req.session.isLoggedIn = true;
        res.redirect('/todos');
    } else {
        res.send('Invalid credentials. <a href="/login">Try again</a>');
    }
});

// Logout Handler (POST)
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// To-Do List Page (GET) - Protected
app.get('/todos', isAuthenticated, (req, res) => {
    let todoList = todos.map((todo, index) => `<li>${todo} <a href="/delete/${index}">Delete</a></li>`).join('');
    res.send(`<h1>To-Do List</h1>
              <ul>${todoList}</ul>
              <form method="POST" action="/add">
                <input type="text" name="todo" placeholder="New To-Do" required />
                <button type="submit">Add</button>
              </form>
              <form method="POST" action="/logout"><button type="submit">Logout</button></form>`);
});

// Add To-Do (POST)
app.post('/add', isAuthenticated, (req, res) => {
    const { todo } = req.body;
    todos.push(todo);
    res.redirect('/todos');
});

// Delete To-Do (GET)
app.get('/delete/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;
    todos.splice(id, 1);
    res.redirect('/todos');
});

// Server Setup
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
