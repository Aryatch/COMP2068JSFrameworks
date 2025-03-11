// Import required modules with comments explaining their roles
const express = require('express'); // Framework for building web applications
const session = require('express-session'); // Session management middleware
const bodyParser = require('body-parser'); // Middleware to parse form data
const passport = require('passport'); // Authentication middleware
const LocalStrategy = require('passport-local').Strategy; // Strategy for handling username-password authentication

// Initialize Express app
const app = express();

// Middleware to parse form data for POST requests
app.use(bodyParser.urlencoded({ extended: true }));

// Set up session management for maintaining user logins
app.use(session({
    secret: 'mysecretkey', // Key to encrypt session data (keep it secure)
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport for handling authentication
app.use(passport.initialize());
app.use(passport.session());

// In-memory user data for demonstration
const users = [
    { id: 1, username: 'Rahul', password: 'pass1' },
];

// Passport authentication strategy setup
passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = users.find(u => u.username === username);
        if (!user) return done(null, false, { message: 'User not found' });
        if (user.password !== password) return done(null, false, { message: 'Wrong password' });
        return done(null, user);
    }
));

// Serialize user to store in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user to retrieve user from session
passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

// Middleware to ensure secure pages are accessible only to logged-in users
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

// In-memory storage for To-Do list (CRUD functionality)
const todos = [];

// ======== Routes ========

// Home Page with improved styling
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`
            <style>
                body { font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px; }
                h1 { color: #4CAF50; }
                a { color: #2196F3; text-decoration: none; padding: 5px; }
                ul { list-style-type: none; padding: 0; }
                li { background: #e3f2fd; margin: 5px 0; padding: 10px; border-radius: 5px; }
                form { margin-top: 20px; }
                button { background-color: #4CAF50; color: white; border: none; padding: 10px 20px; cursor: pointer; }
            </style>
            <h1>Welcome, ${req.user.username}</h1>
            <a href="/logout">Logout</a>
            <h2>Your To-Do List</h2>
            <ul>${todos.map((todo, index) => `<li>${todo} <a href="/update/${index}">Update</a> | <a href="/delete/${index}">Delete</a></li>`).join('')}</ul>
            <form action="/add" method="POST">
                <input type="text" name="todo" placeholder="New task" required>
                <button type="submit">Add</button>
            </form>
        `);
    } else {
        res.send(`
            <style>
                body { text-align: center; font-family: Arial, sans-serif; background-color: #ffe0b2; padding: 20px; }
                h1 { color: #ff5722; }
            </style>
            <h1>Welcome</h1>
            <a href="/login">Login</a> | <a href="/register">Register</a>
        `);
    }
});

// ======== User Registration ========
app.get('/register', (req, res) => {
    res.send(`
        <h1>Register</h1>
        <form method="POST" action="/register">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Register</button>
        </form>
    `);
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.send('<h1>Username already taken</h1><a href="/register">Try Again</a>');
    }

    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);

    console.log('New user registered:', newUser);

    res.send('<h1>Registration successful</h1><a href="/login">Login Here</a>');
});

// ======== User Login ========
app.get('/login', (req, res) => {
    res.send(`
        <h1>Login</h1>
        <form method="POST" action="/login">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    `);
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

// ======== User Logout ========
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
});

// ======== To-Do List (CRUD) ========
app.post('/add', isAuthenticated, (req, res) => {
    todos.push(req.body.todo);
    res.redirect('/');
});

app.get('/update/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;
    res.send(`
        <h1>Update Task</h1>
        <form method="POST" action="/update/${id}">
            <input type="text" name="todo" value="${todos[id]}" required>
            <button type="submit">Update</button>
        </form>
    `);
});

app.post('/update/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;
    todos[id] = req.body.todo;
    res.redirect('/');
});

app.get('/delete/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;
    todos.splice(id, 1);
    res.redirect('/');
});

// Start server on port 3000
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
