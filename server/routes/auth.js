const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const router = express.Router();
const path = require('path');

let loggedInUsers = [];


router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['username']
        });
        const usernames = users.map(user => user.username);
        res.json(loggedInUsers);
    } catch (err) {
        console.error('Błąd podczas pobierania użytkowników:', err.message);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});


router.get('/api/user/posts', async (req, res) => {
    try {

        if (!req.session.user) {
            return res.status(401).json({ message: 'Unauthorized - user not logged in' });
        }

        const username = req.session.user.username;

        const posts = await User.findAll({
            where: { username: username }
        });

        res.status(200).json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});




router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'Użytkownik już istnieje' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            username,
            email,
            password: hashedPassword
        });


        res.status(201).json({ message: 'Rejestracja zakończona sukcesem', userId: user.id });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Nieprawidłowy e-mail lub hasło' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Nieprawidłowy e-mail lub hasło' });
        }

        if (!loggedInUsers.includes(user.username)) {
            loggedInUsers.push(user.username);
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        res.json({ message: 'Zalogowano pomyślnie', token: 'twój-token', username: user.username  });
    } catch (err) {
        console.error('Błąd logowania:', err);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});



router.post('/logout', (req, res) => {
    console.log('Logout request received');
    if (req.session.user) {
        loggedInUsers = loggedInUsers.filter(username => username !== req.session.user.username);
    }

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Błąd przy wylogowaniu' });
        }
        console.log('Session destroyed successfully');
        res.json({ message: 'Successfully logged out' });
    });
});



module.exports = router;
