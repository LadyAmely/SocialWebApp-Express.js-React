
const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const sequelize = require('./config/db');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

//const {WebSocketServer} = require('ws');

const app = express();
const port = 5000;

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
   // res.send(`<h1>Witaj, ${req.session.user.username}!</h1><a href="/">Wyloguj</a>`);
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.get('/api/posts', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query('SELECT * FROM posts');
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.use(express.static(path.join(__dirname, 'client/build')));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const server = http.createServer(app);


const wss = new WebSocket.Server({ server });

/*
wss.on('connection', (ws) => {
    console.log('Connected to the server');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

        wss.clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        console.log(`Current clients connected: ${wss.clients.size}`);
    });

    ws.on('error', (error) => {
        console.error('WebSocket Error:', error);
    });
});

 */

wss.on('connection', (ws) => {
    console.log('Nowe połączenie WebSocket');


    ws.on('message', (message) => {
        console.log('Otrzymano wiadomość od klienta:', message);


        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`${message}`);
            }
        });
    });


    ws.on('close', () => {
        console.log('Klient rozłączony');
    });


   // ws.send('');
});


server.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});