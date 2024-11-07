
const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const sequelize = require('./config/db');
const path = require('path');
const { Post } = require('./models');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 5000;
const userSockets = new Map();



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
app.use('/api/favourite-events', favouriteEventRouter);
//app.use('/api/comment-posts', commentPostRouter);


app.use(express.urlencoded({ extended: true }));

const sessionMiddleware = session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict'
    }
});

app.use(sessionMiddleware);

sequelize.sync().then(() => {
    console.log('Synchronizacja z bazą danych zakończona');
});

app.use('/auth', authRoutes);

app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.get('/api/favourite_events/:username', async(req, res)=>{
    try{
        const { username } = req.params;
        const results = await sequelize.query(
            'SELECT events.* \n' +
            '             FROM favourite_events \n' +
            '             JOIN events ON favourite_events.event_id = events.event_id \n' +
            '             WHERE favourite_events.username = :username',
            {
                replacements: { username: username },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).json(results);

    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/comment-posts', async (req, res) => {
    const { forum_post_id, content, username } = req.body;
    if (!forum_post_id || !content || !username) {
        return res.status(400).json({ error: 'forum_post_id, content, and username are required' });
    }
    try {
        const commentPost = await sequelize.query(
            'INSERT INTO comment_posts (forum_post_id, content, created_at, username) VALUES (:forum_post_id, :content, NOW(), :username)',
            {
                replacements: { forum_post_id, content, username },
                type: sequelize.QueryTypes.INSERT,
            }
        );
        res.status(201).json({
            comment_id: commentPost[0],
            forum_post_id,
            content,
            created_at: new Date(),
            username,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/comment-posts', async(req, res) => {
    try {
        const [results, metadata] = await sequelize.query('SELECT * FROM comment_posts');
        res.status(200).json(results);
    }catch(error){
        console.error('Error fetching news posts:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});


app.post('/api/personal_info', async(req, res) => {
    const {location, interests, observations, favourite_constellations, username} = req.body;

    try {
        const newInfo = await sequelize.query(
            'INSERT INTO personal_data(location, interests, observations, favourite_constellations, username) VALUES (:location, :interests, :observations, :favourite_constellations, :username)',
            {
                replacements: {location, interests, observations, favourite_constellations, username},
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json({ personal_id: newInfo[0], location, interests, observations, favourite_constellations, username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const server = http.createServer(app);

const userStatus = new Map();

const wss = new WebSocket.Server({ server });

const wrap = middleware => (ws, req, next) => middleware(req, {}, next);

wss.on('connection', (ws, req) => {
    wrap(sessionMiddleware)(ws, req, () => {
        if (req.session && req.session.user) {
            const username = req.session.user.username;
            console.log(`WebSocket: użytkownik ${username} połączony`);

            userSockets.set(username, ws);
            userStatus.set(username, { online: true, socket: ws });

            ws.on('message', (message) => {
                console.log(` ${username}: ${message}`);

                const targetUsername = extractTargetUsername(message);
                if (!targetUsername) {
                    ws.send('Błąd: nie podano odbiorcy.');
                    return;
                }

                const targetSocket = userSockets.get(targetUsername);
                if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
                    const parsedMessage = JSON.parse(message);
                    targetSocket.send(`${username}: ${parsedMessage.message}`);
                } else {
                    //ws.send(`Użytkownik ${targetUsername} nie jest dostępny.`);

                }
            });

            ws.on('close', () => {
                console.log(`WebSocket: użytkownik ${username} rozłączony`);
                userSockets.delete(username);
            });
        } else {
            ws.close();
        }
    });
});


function extractTargetUsername(message) {
    try {
        const parsedMessage = JSON.parse(message);
        return parsedMessage.targetUsername;
    } catch (e) {
        console.error('Błąd parsowania wiadomości:', e);
        return null;
    }
}


server.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});