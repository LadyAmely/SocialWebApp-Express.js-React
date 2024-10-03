
const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const sequelize = require('./config/db');

const app = express();
const port = 3003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

sequelize.sync().then(() => {
    console.log('Synchronizacja z bazą danych zakończona');
});

app.use('/auth', authRoutes);

app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    res.send(`<h1>Witaj, ${req.session.user.username}!</h1><a href="/auth/logout">Wyloguj</a>`);
});


app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});
