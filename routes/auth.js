

const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const router = express.Router();
const path = require('path');
const sequelize = require("../config/db");
const {sign} = require("jsonwebtoken");
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

let loggedInUsers = [];
require('dotenv').config();
const jwtSecretKey = process.env.JWT_SECRET_KEY;

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

router.get('/users/user_id', async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ message: 'Brakujący parametr username' });
        }
        const [results, metadata] = await sequelize.query(
            'SELECT * FROM "Users" WHERE username = :username',
            {
                replacements: { username },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (results.length === 0) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error('Błąd podczas pobierania użytkownika:', error.message);
        res.status(500).json({ message: 'Błąd serwera' });
    }
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

        const username = req.user.username;

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
    const { username, email, password, role } = req.body;

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
            password: hashedPassword,
            role: role || 'user',
        });


        res.status(201).json({ message: 'Rejestracja zakończona sukcesem', userId: user.id });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

router.post("/login", async (req, res) => {
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

        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            jwtSecretKey,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Zalogowano pomyślnie', username: user.username, token });
    } catch (err) {
        console.error('Błąd logowania:', err);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

router.post('/logout', (req, res) => {
    console.log('Logout request received');
    res.json({ message: 'Successfully logged out' });
});


module.exports = router;

