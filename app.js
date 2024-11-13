

const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const sequelize = require('./config/db');
const path = require('path');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 5000;
const cookieParser = require('cookie-parser');

const newsRouter = require('./routes/news');
const eventRouter = require('./routes/event');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const communityRouter = require('./routes/community');
const forumRouter = require('./routes/forum');
const userInfoRouter = require('./routes/userInfo');
const commentRouter = require('./routes/comment');
const friendRouter = require('./routes/friend');
const userGroupRouter = require('./routes/userGroups');
const commentGroupRouter = require('./routes/commentGroups');
const commentMainRouter = require('./routes/commentMain');
const commentForumPostRouter = require('./routes/commentForumPost');
const favouriteEventRouter = require('./routes/favouriteEvent');
const commentPostRouter = require('./routes/commentPost');
const dashboardRouter = require('./routes/dashboard');
const initWebSocketServer = require('./websocket');
const {verify} = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use('/api/news', newsRouter);
app.use('/api/events', eventRouter);
app.use('/api/posts', postRouter);
app.use('/api/all-users', userRouter);
app.use('/api/community', communityRouter);
app.use('/api/forum-posts', forumRouter);
app.use('/api/user-info', userInfoRouter);
app.use('/api/comments', commentRouter);
app.use('/api/friends', friendRouter);
app.use('/api/user-groups', userGroupRouter);
app.use('/api/comment-groups', commentGroupRouter);
app.use('/api/comments-main-posts', commentMainRouter);
app.use('/api/comments-forum-posts', commentForumPostRouter);
app.use('/api/favourite_events', favouriteEventRouter);
//app.use('/dashboard', dashboardRouter);
app.use('/api/comment-posts', commentPostRouter);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

sequelize.sync().then(() => {
    console.log('Synchronizacja z bazą danych zakończona');
});

app.use('/auth', authRoutes);
require('dotenv').config();
const jwtSecretKey = process.env.JWT_SECRET_KEY;
/*
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

 */

app.get('/dashboard', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const server = http.createServer(app);
//initWebSocketServer(server, sessionMiddleware);


server.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('Brak tokenu w nagłówku');
        return res.status(401).json({ message: 'Brak autoryzacji - token nie został dostarczony' });
    }

    jwt.verify(token, jwtSecretKey, (err, user) => {
        if (err) {
            console.log('Błąd weryfikacji tokenu:', err);
            return res.status(403).json({ message: 'Token jest nieprawidłowy lub wygasł' });
        }
        req.user = user;
        next();
    });
}
