const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const router = express.Router();
const path = require('path');



router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

/*
router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './public' });
});

 */

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
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


/*

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Otrzymano żądanie logowania:", req.body);

    try {

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).send('Nieprawidłowy e-mail lub hasło');
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Nieprawidłowy e-mail lub hasło');
        }


        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Błąd serwera');
    }
});

 */

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Otrzymano żądanie logowania:", req.body);

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Nieprawidłowy e-mail lub hasło' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Nieprawidłowy e-mail lub hasło' });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        res.json({ message: 'Zalogowano pomyślnie', token: 'twój-token' });
    } catch (err) {
        console.error('Błąd logowania:', err);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});



router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Błąd przy wylogowaniu' });
        }
        res.redirect('/');
    });
});

module.exports = router;
